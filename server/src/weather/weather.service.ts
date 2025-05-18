import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RedisService } from 'infra/redis.service';
import { WeatherAlert } from './weather-alert';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly weatherUrl =
    'https://api.openweathermap.org/data/2.5/weather';
  private readonly forecastUrl =
    'https://api.openweathermap.org/data/2.5/forecast';
  private readonly airQualityUrl =
    'https://api.openweathermap.org/data/2.5/air_pollution';

  constructor(
    private configService: ConfigService,
    private redis: RedisService,
  ) {
    this.apiKey = process.env.WEATHER_API_KEY as string;
  }

  async getWeatherByCity(city: string) {
    const cacheKey = `weather:${city.toLowerCase()}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.weatherUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await axios.get(url);
      await this.redis.set(cacheKey, response.data, 3600);
      return response.data;
    } catch (error) {
      throw new BadRequestException(
        'Erro ao buscar clima. Verifique o nome da cidade.',
      );
    }
  }

  async getForecastByCity(city: string) {
    const cacheKey = `forecast:${city.toLowerCase()}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await axios.get(url);
      await this.redis.set(cacheKey, response.data, 6 * 3600);
      return response.data;
    } catch {
      throw new BadRequestException(
        'Erro ao buscar previsão. Cidade inválida ou indisponível.',
      );
    }
  }

  async getWeatherByCoords(lat: number, lon: number) {
    const cacheKey = `weather:latlon:${lat}:${lon}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.weatherUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await axios.get(url);
      await this.redis.set(cacheKey, response.data, 3600);
      return response.data;
    } catch {
      throw new BadRequestException('Erro ao buscar clima por coordenadas.');
    }
  }

  async getAlertsByCity(city: string) {
    const cacheKey = `alerts:${city.toLowerCase()}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    try {
      const forecast = await this.getForecastByCity(city);
      const alerts = this.generateAlerts(forecast.list);
      await this.redis.set(cacheKey, alerts, 3600);
      return alerts;
    } catch {
      throw new BadRequestException('Erro ao gerar alertas para esta cidade.');
    }
  }

  async getAirQualityByCity(city: string) {
    const cacheKey = `air-quality:${city.toLowerCase()}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    try {
      const weatherData = await this.getWeatherByCity(city);
      const { coord } = weatherData;
      const url = `${this.airQualityUrl}?lat=${coord.lat}&lon=${coord.lon}&appid=${this.apiKey}`;
      const response = await axios.get(url);
      await this.redis.set(cacheKey, response.data, 3600);
      return response.data;
    } catch {
      throw new BadRequestException('Erro ao buscar qualidade do ar.');
    }
  }

  private generateAlerts(forecastList: any[]): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];

    for (const entry of forecastList) {
      const temp = entry.main.temp;
      const wind = entry.wind.speed;
      const rain = entry.rain?.['3h'] || 0;
      const weather = entry.weather[0].main.toLowerCase();
      const time = entry.dt_txt;

      if (temp >= 35) {
        alerts.push({
          type: 'temperature',
          severity: temp >= 40 ? 'extreme' : 'severe',
          title: 'Alerta de Calor Intenso',
          description: `Temperatura prevista de ${Math.round(temp)}°C.`,
          time,
        });
      }

      if (temp <= 5) {
        alerts.push({
          type: 'temperature',
          severity: temp <= 0 ? 'extreme' : 'severe',
          title: 'Alerta de Frio Intenso',
          description: `Temperatura prevista de ${Math.round(temp)}°C.`,
          time,
        });
      }

      if (wind >= 15) {
        alerts.push({
          type: 'wind',
          severity: wind >= 25 ? 'extreme' : 'severe',
          title: 'Aviso de Ventos Fortes',
          description: `Ventos de até ${Math.round(wind * 3.6)} km/h.`,
          time,
        });
      }

      if (rain >= 10) {
        alerts.push({
          type: 'rain',
          severity: rain >= 30 ? 'severe' : 'moderate',
          title: 'Alerta de Chuva Intensa',
          description: `Previsão de ${rain} mm de chuva.`,
          time,
        });
      }

      if (weather.includes('storm') || weather.includes('thunderstorm')) {
        alerts.push({
          type: 'storm',
          severity: 'severe',
          title: 'Alerta de Tempestade',
          description: 'Tempestades previstas. Evite áreas abertas.',
          time,
        });
      }
    }

    return alerts.slice(0, 5);
  }
}

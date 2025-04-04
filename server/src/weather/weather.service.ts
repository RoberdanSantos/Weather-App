import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private configService: ConfigService) {
    this.apiKey = process.env.WEATHER_API_KEY as string;
  }

  async getWeatherByCity(city: string, country = 'BR') {
    try {
      const url = `${this.baseUrl}?q=${city},${country}&appid=${this.apiKey}&units=metric&lang=pt_br`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Error searching for weather data');
    }
  }
}

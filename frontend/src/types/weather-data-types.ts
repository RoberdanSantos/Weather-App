import { weatherIcons } from "@/lib/weather-icons";

export interface ForecastDataPoint {
  day: string;
  hour: string;
  temp: number;
  feelsLike: number;
  weather: "ensolarado" | "nublado" | "chuva" | "garoa" | "neve" | "tempestade";
  humidity: number;
  windSpeed: number;
  pressure: number;
  clouds: number;
}

export interface Alert {
  type: string;
  severity: "minor" | "moderate" | "severe" | "extreme";
  title: string;
  description: string;
  time: string;
}

export interface CurrentWeatherCardProps {
  city: string;
  weather: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  wind: {
    speed: number;
    direction: string;
  };
}

export interface WeatherAlertsCardProps {
  city: string;
}

export interface ThermalAmplitudeCardProps {
  minTemp: number;
  maxTemp: number;
}

export interface AirQualityCardProps {
  aqi: number;
  pollutants: {
    pm2_5: number;
    pm10: number;
    o3: number;
    no2: number;
  };
}

export interface WeatherForecastChartProps {
  city: string;
}

export interface SunTimesCardProps {
  sunrise: string;
  sunset: string;
  dayLength: string;
}

export interface WeatherDetailsCardProps {
  visibility: number;
  pressure: number;
  precipitation: number;
}

export interface LocationCardProps {
  latitude: number;
  longitude: number;
}

export interface BasicWeatherData {
  city: string;
  temperature: number;
  condition: string;
  iconKey: keyof typeof weatherIcons;
  loading: boolean;
  error: string | null;
}
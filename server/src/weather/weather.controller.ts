import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather(@Query('city') city: string, @Query('country') country = 'BR') {
    return this.weatherService.getWeatherByCity(city, country);
  }
}

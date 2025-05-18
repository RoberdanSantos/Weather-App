import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Obter clima atual por cidade' })
  @ApiQuery({ name: 'city', required: true, example: 'São Paulo' })
  @ApiResponse({
    status: 200,
    description: 'Dados climáticos obtidos com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao buscar clima. Verifique o nome da cidade.',
  })
  getWeather(@Query('city') city: string) {
    return this.weatherService.getWeatherByCity(city);
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Obter previsão de 5 dias por cidade' })
  @ApiQuery({ name: 'city', required: true, example: 'Curitiba' })
  @ApiResponse({ status: 200, description: 'Previsão obtida com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao buscar previsão. Cidade inválida ou indisponível.',
  })
  getForecast(@Query('city') city: string) {
    return this.weatherService.getForecastByCity(city);
  }

  @Get('by-coords')
  @ApiOperation({ summary: 'Obter clima por coordenadas' })
  @ApiQuery({ name: 'lat', required: true, example: '-23.5505' })
  @ApiQuery({ name: 'lon', required: true, example: '-46.6333' })
  @ApiResponse({
    status: 200,
    description: 'Clima obtido com sucesso via coordenadas.',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao buscar clima por coordenadas.',
  })
  getWeatherByCoords(@Query('lat') lat: string, @Query('lon') lon: string) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      throw new BadRequestException('Invalid Coords.');
    }

    return this.weatherService.getWeatherByCoords(latNum, lonNum);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Obter alertas climáticos com base na previsão' })
  @ApiQuery({ name: 'city', required: true, example: 'Porto Alegre' })
  @ApiResponse({ status: 200, description: 'Alertas gerados com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao gerar alertas para esta cidade.',
  })
  getAlerts(@Query('city') city: string) {
    return this.weatherService.getAlertsByCity(city);
  }

  @Get('air-quality')
  @ApiOperation({ summary: 'Obter qualidade do ar por cidade' })
  @ApiQuery({ name: 'city', required: true, example: 'Recife' })
  @ApiResponse({
    status: 200,
    description: 'Dados de qualidade do ar obtidos com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Erro ao buscar qualidade do ar.' })
  getAirQuality(@Query('city') city: string) {
    return this.weatherService.getAirQualityByCity(city);
  }
}

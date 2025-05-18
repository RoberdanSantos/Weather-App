import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InfraModule } from './infra/infra.module';
import { FavoriteLocationModule } from './favorite-location/favorite-location.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WeatherModule,
    AuthModule,
    UserModule,
    InfraModule,
    FavoriteLocationModule,
    LogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

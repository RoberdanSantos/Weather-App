import { Card, CardContent } from "@/components/ui/card";
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Sun } from "lucide-react";
import { CurrentWeatherCardProps } from "@/types/weather-data-types";

export function CurrentWeatherCard({
  city,
  weather,
  temperature,
  feelsLike,
  humidity,
  wind,
}: CurrentWeatherCardProps) {
  const getWeatherIcon = () => {
    const weatherLower = weather.toLowerCase();
    if (weatherLower.includes("sun") || weatherLower.includes("clear"))
      return Sun;
    if (weatherLower.includes("rain")) return CloudRain;
    if (weatherLower.includes("drizzle")) return CloudDrizzle;
    if (weatherLower.includes("snow")) return CloudSnow;
    return Cloud;
  };

  const WeatherIcon = getWeatherIcon();

  return (
    <Card className="bg-white/80 border-sky-200 overflow-hidden w-full p-0">
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2">
        <h2 className="text-lg font-semibold">{city}</h2>
      </div>

      <CardContent className="pt-6 pb-4 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center">
              <WeatherIcon className="h-12 w-12 text-sky-500 mr-3" />
              <div>
                <div className="text-3xl font-bold">{temperature}°C</div>
                <div className="text-sm text-sky-700">
                  Sensação: {feelsLike}°C
                </div>
              </div>
            </div>
            <div className="text-sky-900 text-base sm:text-xl font-medium sm:self-center">
              {weather}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sky-50 p-3 rounded-lg">
              <div className="text-sm text-sky-600 mb-1">Umidade</div>
              <div className="text-xl font-medium">{humidity}%</div>
            </div>

            <div className="bg-sky-50 p-3 rounded-lg">
              <div className="text-sm text-sky-600 mb-1">Vento</div>
              <div className="text-xl font-medium">
                {wind.speed} km/h {wind.direction}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

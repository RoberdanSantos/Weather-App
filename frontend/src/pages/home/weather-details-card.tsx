import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Eye, Gauge } from "lucide-react";
import { WeatherDetailsCardProps } from "@/types/weather-data-types";

export function WeatherDetailsCard({
  visibility,
  pressure,
  precipitation,
}: WeatherDetailsCardProps) {
  return (
    <Card className="bg-white/80 border-sky-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-sky-900">
          Detalhes do Clima
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-sky-500 mr-2" />
              <span className="text-sm font-medium">Visibilidade</span>
            </div>
            <span className="text-lg font-bold">{visibility} km</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gauge className="h-5 w-5 text-sky-500 mr-2" />
              <span className="text-sm font-medium">Pressão</span>
            </div>
            <span className="text-lg font-bold">{pressure} hPa</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Droplets className="h-5 w-5 text-sky-500 mr-2" />
              <span className="text-sm font-medium">Precipitação</span>
            </div>
            <span className="text-lg font-bold">{precipitation}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AirQualityCardProps } from "@/types/weather-data-types";

export function AirQualityCard({ aqi, pollutants }: AirQualityCardProps) {
  const getAQILevel = (index: number) => {
    if (index <= 50)
      return { level: "Boa", color: "text-green-500", bg: "bg-green-100" };
    if (index <= 100)
      return {
        level: "Moderada",
        color: "text-yellow-500",
        bg: "bg-yellow-100",
      };
    if (index <= 150)
      return {
        level: "Insalubre para grupos sensíveis",
        color: "text-orange-500",
        bg: "bg-orange-100",
      };
    if (index <= 200)
      return { level: "Insalubre", color: "text-red-500", bg: "bg-red-100" };
    if (index <= 300)
      return {
        level: "Muito insalubre",
        color: "text-purple-500",
        bg: "bg-purple-100",
      };
    return { level: "Perigosa", color: "text-rose-700", bg: "bg-rose-100" };
  };

  const { level, color, bg } = getAQILevel(aqi);
  const percentage = Math.min((aqi / 500) * 100, 100);

  return (
    <Card className="bg-white/80 border-sky-200 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-sky-900">
          Qualidade do Ar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="text-3xl font-bold">{aqi}</span>
            <span className={`${color} font-medium text-sm`}>{level}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full ${bg} relative`}
              style={{ width: `${percentage}%` }}
            >
              <div
                className={`absolute top-0 right-0 h-full w-1 ${color}`}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sky-800">
            <div className="flex flex-col">
              <span className="text-xs text-sky-600">PM2.5</span>
              <span className="text-sm font-medium">
                {pollutants.pm2_5} μg/m³
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-sky-600">PM10</span>
              <span className="text-sm font-medium">
                {pollutants.pm10} μg/m³
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-sky-600">Ozônio (O₃)</span>
              <span className="text-sm font-medium">{pollutants.o3} μg/m³</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-sky-600">NO₂</span>
              <span className="text-sm font-medium">
                {pollutants.no2} μg/m³
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

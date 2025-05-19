import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useForecast } from "@/hooks/useForecast";
import { weatherIcons, weatherGradients } from "@/lib/weather-icons";
import { WeatherForecastChartProps } from "@/types/weather-data-types";


export function WeatherForecastChart({ city }: WeatherForecastChartProps) {
  const { forecast, loading, activeIndex, setActiveIndex } = useForecast(
    city,
  );
  const activePoint =
    forecast.length > 0 ? forecast[activeIndex || 0] : undefined;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const Icon = weatherIcons[data.weather as keyof typeof weatherIcons];

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-sky-100 w-80">
          <p className="font-medium text-sky-900">
            {data.day}, {data.hour}
          </p>
          <div className="flex items-center gap-2 my-1">
            <Icon className="h-5 w-5 text-sky-600" />
            <span className="capitalize text-sky-700">{data.weather}</span>
          </div>
          <p className="text-sky-900 font-medium">
            {Math.round(data.temp)}°C{" "}
            <span className="text-sm text-sky-700">
              (Feels like {Math.round(data.feelsLike)}°C)
            </span>
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm text-sky-700 w-full">
            <p>💨 Wind: {Math.round(data.windSpeed * 3.6)} km/h</p>
            <p>💧 Humidity: {data.humidity}%</p>
            <p>☁️ Clouds: {data.clouds}%</p>
            <p>📈 Pressure: {data.pressure} hPa</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/80 border-sky-200 h-fit w-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-xl text-sky-900">
          {city ? `Previsão de 7 dias para ${city}` : "Previsão de 7 dias"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading || forecast.length === 0 ? (
          <Skeleton className="w-full h-[300px] rounded-md" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={forecast}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <defs>
                  {forecast.map((entry, index) => {
                    const gradient = weatherGradients[entry.weather];
                    const startColor = gradient?.[0] || "#0284C7";
                    const endColor = gradient?.[1] || "#7DD3FC";

                    return (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`gradient-${entry.weather}-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={startColor}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor={endColor}
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    );
                  })}
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#64748B", fontSize: 10 }}
                  tickLine={{ stroke: "#94A3B8" }}
                  axisLine={{ stroke: "#CBD5E1" }}
                />
                <YAxis
                  unit="°C"
                  tick={{ fill: "#64748B", fontSize: 10 }}
                  tickLine={{ stroke: "#94A3B8" }}
                  axisLine={{ stroke: "#CBD5E1" }}
                  domain={["dataMin - 2", "dataMax + 2"]}
                />
                <Tooltip content={<CustomTooltip />} />
                {activePoint && (
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="#0284C7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#gradient-${activePoint.weather}-${activeIndex || 0})`}
                    activeDot={{
                      r: 6,
                      stroke: "#0284C7",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";
import { ForecastDataPoint } from "@/types/weather-data-types";
import { translateWeather } from "@/lib/weather-icons";
import { getForecastByCity } from "@/lib/api";

export function useForecast(city: string) {
  const { toast } = useToast();
  const [forecast, setForecast] = useState<ForecastDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true);

        const res = await getForecastByCity(city)

        const data = res.data.list;

        const grouped = data.reduce((acc: ForecastDataPoint[], item: any) => {
          const date = new Date(item.dt_txt);
          const day = date.toLocaleDateString("pt-BR", { weekday: "short" });
          const exists = acc.find((e) => e.day === day);

          if (!exists && acc.length < 7) {
            acc.push({
              day,
              hour: date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              temp: item.main.temp,
              feelsLike: item.main.feels_like,
              weather: translateWeather(item.weather[0].main),
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
              pressure: item.main.pressure,
              clouds: item.clouds.all,
            });
          }

          return acc;
        }, []);

        setForecast(grouped);
      } catch (err) {
        toast({
          title: "Erro",
          description: "Erro ao buscar previsão.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (city) fetchForecast();
  }, [city]);

  return { forecast, loading, activeIndex, setActiveIndex };
}

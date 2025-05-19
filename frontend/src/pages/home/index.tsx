import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import axios from "axios";
import { Search, MapPin, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherForecastChart } from "./weather-forecast-chart";
import { CurrentWeatherCard } from "./current-weather-card";
import { ThermalAmplitudeCard } from "./thermal-amplitude-card";
import { AirQualityCard } from "./air-quality-card";
import { WeatherAlertsCard } from "./weather-alert-card";
import { SunTimesCard } from "./sum-times-card";
import { calculateDayLength, formatUnixToTime } from "@/lib/timeFormats";
import { WeatherDetailsCard } from "./weather-details-card";
import { LocationCard } from "./location-card";
import {
  addFavorite,
  addSearchLog,
  deleteFavorite,
  getFavorites,
  updateRecentCity,
} from "@/lib/api";

export default function Home() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [airQuality, setAirQuality] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAirQuality, setLoadingAirQuality] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const suggestedCities = user?.recentCities?.length
    ? user.recentCities
    : ["New York", "London", "Tokyo", "Paris", "Sydney", "Rio de Janeiro"];

  const fetchWeather = async (cityName: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/weather`,
        {
          params: { city: cityName },
          withCredentials: true,
        },
      );
      setWeatherData(res.data);
      fetchAirQuality(cityName);
      await addSearchLog({
        location: cityName,
        temperature: Math.round(res.data.main.temp),
        condition: res.data.weather[0].main.toLowerCase(),
      });
      await updateRecentCity(cityName);

      if (user?.recentCities && user.address?.city !== cityName) {
        const updated = [
          cityName,
          ...user.recentCities.filter((c) => c !== cityName),
        ];
        if (updated.length > 6) updated.splice(6);
        user.recentCities = updated;
      }
    } catch {
      toast({
        title: "Erro",
        description: "Cidade não encontrada.",
        variant: "error",
      });
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAirQuality = async (cityName: string) => {
    try {
      setLoadingAirQuality(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/weather/air-quality`,
        {
          params: { city: cityName },
          withCredentials: true,
        },
      );

      const aqiData = res.data.list[0];

      setAirQuality({
        aqi: aqiData.main.aqi * 50,
        pollutants: {
          pm2_5: aqiData.components.pm2_5,
          pm10: aqiData.components.pm10,
          o3: aqiData.components.o3,
          no2: aqiData.components.no2,
        },
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao buscar qualidade do ar.",
        variant: "error",
      });
      setAirQuality(null);
    } finally {
      setLoadingAirQuality(false);
    }
  };

  useEffect(() => {
    const loadCity = async () => {
      const selectedCity = localStorage.getItem("weather@selectedCity");

      if (selectedCity) {
        await fetchWeather(selectedCity);
        localStorage.removeItem("weather@selectedCity");
      } else if (user?.address?.city) {
        await fetchWeather(user.address.city);
      }
    };

    loadCity();
    fetchFavorites();
  }, [user]);

  const handleSearch = () => {
    const trimmed = city.trim();

    if (!trimmed) {
      toast({
        title: "Campo vazio",
        description: "Digite o nome de uma cidade antes de buscar.",
        variant: "error",
      });
      return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s'-]{2,}$/.test(trimmed)) {
      toast({
        title: "Entrada inválida",
        description: "Digite um nome de cidade válido.",
        variant: "error",
      });
      return;
    }

    fetchWeather(trimmed);
  };

  const getWindDirection = (degree: number): string => {
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  };

  const isInFavorites = favorites.includes(weatherData?.name);

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites();
      const cities = res.data.map((fav: { name: string }) => fav.name);
      setFavorites(cities);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao buscar favoritos.",
        variant: "error",
      });
    }
  };

  const toggleFavorite = async () => {
    if (!weatherData) return;

    setLoadingFavorites(true);

    try {
      if (isInFavorites) {
        const idToRemove = await getFavorites().then(
          (res) =>
            res.data.find(
              (fav: { name: string }) => fav.name === weatherData.name,
            )?.id,
        );
        if (idToRemove) await deleteFavorite(idToRemove);
      } else {
        await addFavorite({
          name: weatherData.name,
          country: weatherData.sys.country,
        });
      }

      fetchFavorites();

      toast({
        title: isInFavorites
          ? "Removido dos favoritos"
          : "Adicionado aos favoritos",
        description: `${weatherData.name} foi ${isInFavorites ? "removido" : "adicionado"} com sucesso.`,
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível alterar os favoritos.",
        variant: "error",
      });
    } finally {
      setLoadingFavorites(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <Card className="mb-6 bg-gradient-to-r from-sky-500/90 to-sky-600/90 border-sky-400 shadow-lg">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-white mr-2" />
                  <h2 className="text-lg font-medium text-white">
                    {weatherData
                      ? `${weatherData.name}`
                      : "Busque por uma cidade"}
                  </h2>
                </div>
                {weatherData && weatherData.main ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="text-white hover:bg-white/20 cursor-pointer"
                      onClick={toggleFavorite}
                      disabled={loadingFavorites}
                    >
                      <Heart
                        className={`h-4 w-4 mr-0.5 ${
                          isInFavorites
                            ? "text-red-500 fill-red-500"
                            : "text-white fill-none"
                        }`}
                        fill="currentColor"
                      />
                    </Button>
                    <div className="text-2xl font-bold text-white">
                      {Math.round(weatherData.main.temp)}°C
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Digite o nome da cidade..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="bg-white/90 border-sky-200 pr-10 h-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sky-500" />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-white text-sky-600 hover:bg-sky-50 h-10 cursor-pointer"
                >
                  Buscar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {suggestedCities.map((city) => (
                  <Button
                    key={city}
                    variant="outline"
                    size="sm"
                    className="bg-white/30 text-white border-white/40 hover:bg-white/50 hover:text-sky-900 cursor-pointer"
                    onClick={() => {
                      setCity(city);
                      fetchWeather(city);
                    }}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="bg-white/80 border border-primary/20">
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-24 w-full mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-16 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : weatherData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CurrentWeatherCard
              city={weatherData.name}
              weather={weatherData.weather[0].description}
              temperature={Math.round(weatherData.main.temp)}
              feelsLike={Math.round(weatherData.main.feels_like)}
              humidity={weatherData.main.humidity}
              wind={{
                speed: Math.round(weatherData.wind.speed * 3.6),
                direction: getWindDirection(weatherData.wind.deg),
              }}
            />

            <ThermalAmplitudeCard
              minTemp={Math.round(weatherData.main.temp_min)}
              maxTemp={Math.round(weatherData.main.temp_max)}
            />

            {loadingAirQuality ? (
              <Skeleton className="h-[200px] rounded-lg" />
            ) : airQuality ? (
              <AirQualityCard
                aqi={airQuality.aqi}
                pollutants={airQuality.pollutants}
              />
            ) : (
              <Skeleton className="h-[200px] rounded-lg" />
            )}
            <div className="lg:col-span-2">
              <WeatherForecastChart city={weatherData.name} />
            </div>
            <WeatherAlertsCard city={weatherData.name} />
            <SunTimesCard
              sunrise={formatUnixToTime(weatherData.sys.sunrise)}
              sunset={formatUnixToTime(weatherData.sys.sunset)}
              dayLength={calculateDayLength(
                weatherData.sys.sunrise,
                weatherData.sys.sunset,
              )}
            />
            <WeatherDetailsCard
              visibility={Math.round(weatherData.visibility / 1000)}
              pressure={weatherData.main.pressure}
              precipitation={
                weatherData.pop ? Math.round(weatherData.pop * 100) : 0
              }
            />
            <LocationCard
              latitude={weatherData.coord.lat}
              longitude={weatherData.coord.lon}
            />
          </div>
        ) : (
          <div className="text-base text-blue p-6 text-center w-full max-w-2xl">
            Digite uma cidade e clique em buscar para ver o clima.
          </div>
        )}
      </div>
    </main>
  );
}

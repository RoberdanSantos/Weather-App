import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWeatherByCoords } from "@/lib/api";
import { Loader2, LogIn, UserPlus, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { weatherIcons, translateWeather } from "@/lib/weather-icons";
import { BasicWeatherData } from "@/types/weather-data-types";
import { useToast } from "@/context/toast-context";

export default function LandingPage() {
  const { toast } = useToast();

  const [weather, setWeather] = useState<BasicWeatherData>({
    city: "",
    temperature: 0,
    condition: "",
    iconKey: "nublado",
    loading: true,
    error: null,
  });

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setWeather((prev) => ({ ...prev, loading: true }));
      const res = await getWeatherByCoords(lat, lon);
      const data = res.data;
      const iconKey = translateWeather(data.weather[0].main);

      setWeather({
        city: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        iconKey,
        loading: false,
        error: null,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao obter dados do clima. Tente novamente.",
        variant: "error",
      });
      setWeather((prev) => ({
        ...prev,
        loading: false,
        error: "Erro ao obter dados do clima. Tente novamente.",
      }));
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (_err) => {
          toast({
            title: "Erro de localização",
            description:
              "Não foi possível acessar sua localização. Verifique as permissões.",
            variant: "error",
          });
          setWeather((prev) => ({
            ...prev,
            loading: false,
            error:
              "Não foi possível acessar sua localização. Permita o acesso ou faça login para buscar manualmente.",
          }));
        },
      );
    } else {
      toast({
        title: "Geolocalização não suportada",
        description:
          "Seu navegador não suporta geolocalização. Faça login para buscar manualmente.",
        variant: "error",
      });
      setWeather((prev) => ({
        ...prev,
        loading: false,
        error:
          "Seu navegador não suporta geolocalização. Faça login para buscar manualmente.",
      }));
    }
  }, []);

  const renderWeatherIcon = () => {
    const Icon = weatherIcons[weather.iconKey] ?? Cloud;
    return <Icon className="h-16 w-16 text-sky-500 animate-pulse" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold text-sky-900 mb-2">WeatherApp</h1>
          <p className="text-sky-700">
            Veja as condições climáticas da sua região. Crie uma conta para
            acessar todos os recursos.
          </p>
        </div>

        <Card className="max-w-md w-full bg-white/90 border-sky-200 shadow-lg">
          <CardContent className="p-6">
            {weather.loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-sky-500 animate-spin mb-4" />
                <p className="text-sky-700">Detectando sua localização...</p>
              </div>
            ) : weather.error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{weather.error}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button className="bg-sky-600 hover:bg-sky-700" asChild>
                    <Link to="/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Criar Conta
                    </Link>
                  </Button>
                  <Button variant="outline" className="text-sky-600" asChild>
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-4">{renderWeatherIcon()}</div>
                <h2 className="text-2xl font-bold text-sky-900 mb-1">
                  {weather.city}
                </h2>
                <div className="text-4xl font-bold mb-2">
                  {weather.temperature}°C
                </div>
                <p className="text-sky-700 mb-6">{weather.condition}</p>

                <div className="w-full border-t border-gray-200 pt-6 mt-2">
                  <p className="text-center text-sky-700 mb-4">
                    Crie uma conta para acessar previsão completa, qualidade do
                    ar e mais.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-sky-600 hover:bg-sky-700" asChild>
                      <Link to="/signup">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Criar Conta
                      </Link>
                    </Button>
                    <Button variant="outline" className="text-sky-600" asChild>
                      <Link to="/login">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

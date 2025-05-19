import { useState, useEffect } from "react";
import { useToast } from "@/context/toast-context";
import { Alert } from "@/types/weather-data-types";
import { getWeatherAlerts } from "@/lib/api";

export function useAlerts(city: string) {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!city) return;

      setLoading(true);

      try {
        const res = await getWeatherAlerts(city);
        setAlerts(res.data || []);
      } catch (err) {
        toast({
          title: "Erro",
          description: "Erro ao buscar alertas.",
          variant: "error",
        });
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [city]);

  return { alerts, loading };
}

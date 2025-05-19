import { useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { WeatherAlertsCardProps } from "@/types/weather-data-types";

export function WeatherAlertsCard({ city }: WeatherAlertsCardProps) {
  const { alerts, loading } = useAlerts(city);
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

  const toggleAlert = (index: number) => {
    setExpandedAlert(expandedAlert === index ? null : index);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "text-yellow-500 bg-yellow-50";
      case "moderate":
        return "text-orange-500 bg-orange-50";
      case "severe":
        return "text-red-500 bg-red-50";
      case "extreme":
        return "text-rose-600 bg-rose-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <Card className="bg-white/80 border-sky-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-sky-900 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          Alertas Climáticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-sm text-sky-700">
            Carregando alertas...
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            Nenhum alerta climático ativo para esta cidade
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={`${alert.title}-${alert.time}`}
                className={`rounded-md overflow-hidden border ${getSeverityColor(alert.severity)}`}
              >
                <div
                  role="button"
                  aria-expanded={expandedAlert === index}
                  className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleAlert(index)}
                >
                  <div className="flex items-center">
                    <span
                      className="text-sm font-medium truncate"
                      title={alert.title}
                    >
                      {alert.title}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">{alert.time}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedAlert === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedAlert === index && (
                  <div className="p-2 pt-0 text-sm border-t border-gray-200">
                    <p>{alert.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

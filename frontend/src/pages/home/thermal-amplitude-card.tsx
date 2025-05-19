import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Thermometer } from "lucide-react";
import { ThermalAmplitudeCardProps } from "@/types/weather-data-types";

export function ThermalAmplitudeCard({
  minTemp,
  maxTemp,
}: ThermalAmplitudeCardProps) {
  const amplitude = maxTemp - minTemp;

  const rangeMin = Math.min(minTemp, maxTemp);
  const rangeMax = Math.max(minTemp, maxTemp);
  const totalRange = 50;
  const startPosition = ((rangeMin + 10) / totalRange) * 100;
  const rangeWidth = ((rangeMax - rangeMin) / totalRange) * 100;

  return (
    <Card className="bg-white/80 border-sky-200 w-full">
      <CardHeader className="pb-2 text-sky-900 text-sm font-medium">
        Variação de Temperatura
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ArrowDown className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <div className="text-sm text-sky-700">Temperatura Mínima</div>
                <div className="text-xl font-bold">{minTemp}°C</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right">
                <div className="text-sm text-sky-700">Temperatura Máxima</div>
                <div className="text-xl font-bold">{maxTemp}°C</div>
              </div>
              <ArrowUp className="h-5 w-5 text-red-500 ml-2" />
            </div>
          </div>

          <div>
            <div className="relative h-8 bg-gradient-to-r from-blue-500 via-green-400 to-red-500 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-white/30 border-l-2 border-r-2 border-white"
                style={{
                  left: `${startPosition}%`,
                  width: `${rangeWidth}%`,
                }}
              />
              <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-[10px] text-white font-medium">
                <span>-10°C</span>
                <span>0°C</span>
                <span>10°C</span>
                <span>20°C</span>
                <span>30°C</span>
                <span>40°C</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-sky-100">
            <div className="flex items-center text-sm text-sky-800">
              <Thermometer className="h-5 w-5 text-sky-600 mr-2" />
              Amplitude térmica
            </div>
            <div className="text-lg font-bold">{amplitude}°C</div>
          </div>

          <div className="text-xs text-sky-700 mt-1">
            {amplitude <= 5 && "Baixa variação térmica. Condições estáveis."}
            {amplitude > 5 &&
              amplitude <= 10 &&
              "Variação moderada ao longo do dia."}
            {amplitude > 10 &&
              amplitude <= 15 &&
              "Diferença significativa. Vista-se em camadas."}
            {amplitude > 15 &&
              "Variação extrema. Prepare-se para mudanças bruscas."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

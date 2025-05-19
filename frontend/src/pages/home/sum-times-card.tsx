import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sunrise, Sunset } from "lucide-react";
import { SunTimesCardProps } from "@/types/weather-data-types";

export function SunTimesCard({ sunrise, sunset, dayLength }: SunTimesCardProps) {
  return (
    <Card className="bg-white/80 border-sky-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-sky-900">
          Nascer e Pôr do Sol
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sunrise className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-sm font-medium">Nascer do Sol</span>
            </div>
            <span className="text-lg font-bold">{sunrise}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sunset className="h-5 w-5 text-orange-500 mr-2" />
              <span className="text-sm font-medium">Pôr do Sol</span>
            </div>
            <span className="text-lg font-bold">{sunset}</span>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Duração do Dia</span>
              <span className="text-sm font-medium">{dayLength}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

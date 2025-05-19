import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { LocationCardProps } from "@/types/weather-data-types";

export function LocationCard({ latitude, longitude }: LocationCardProps) {
  return (
    <Card className="bg-white/80 border-sky-200">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <MapPin className="h-5 w-5 text-sky-500" />
        <CardTitle className="text-sm font-medium text-sky-900">
          Localização
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sky-700">
          <div className="flex justify-between">
            <span className="text-sm">Latitude</span>
            <span className="text-lg font-medium">{latitude.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Longitude</span>
            <span className="text-lg font-medium">{longitude.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

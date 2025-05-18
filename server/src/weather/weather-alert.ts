export interface WeatherAlert {
  type: "temperature" | "wind" | "rain" | "snow" | "storm";
  severity: "minor" | "moderate" | "severe" | "extreme";
  title: string;
  description: string;
  time: string;
}

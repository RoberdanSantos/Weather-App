import {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
} from "lucide-react";

export const weatherIcons = {
  ensolarado: Sun,
  nublado: Cloud,
  chuva: CloudRain,
  garoa: CloudDrizzle,
  neve: CloudSnow,
  tempestade: CloudLightning,
};

export const weatherGradients = {
  ensolarado: ["#FFD700", "#FF8C00"],
  nublado: ["#B0C4DE", "#778899"],
  chuva: ["#4682B4", "#000080"],
  garoa: ["#87CEEB", "#4682B4"],
  neve: ["#E0FFFF", "#B0E0E6"],
  tempestade: ["#483D8B", "#191970"],
};

export const translateWeather = (main: string): keyof typeof weatherIcons => {
  const lower = main.toLowerCase();
  if (lower.includes("rain")) return "chuva";
  if (lower.includes("drizzle")) return "garoa";
  if (lower.includes("snow")) return "neve";
  if (lower.includes("storm") || lower.includes("thunder")) return "tempestade";
  if (lower.includes("cloud")) return "nublado";
  if (lower.includes("clear")) return "ensolarado";
  return "nublado";
};

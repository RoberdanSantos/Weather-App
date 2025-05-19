export const formatDay = (dateString: string): string => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
};

export const formatHour = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  return `${hours.toString().padStart(2, "0")}:00`;
};

export const formatUnixToTime = (unixTime: number) => {
  const date = new Date(unixTime * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const calculateDayLength = (sunriseUnix: number, sunsetUnix: number) => {
  const durationSec = sunsetUnix - sunriseUnix;
  const hours = Math.floor(durationSec / 3600);
  const minutes = Math.floor((durationSec % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));

export const formatTime = (date: string): string =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

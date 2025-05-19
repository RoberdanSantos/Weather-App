import { API } from "./axios";

// AUTH
export const login = (email: string, password: string) =>
  API.post("/auth/login", { email, password });

export const register = (data: {
  email: string;
  password: string;
  name: string;
}) => API.post("/auth/register", data);

export const logout = () => API.post("/auth/logout");

export const getProfile = () => API.get("/auth/me");

export const forgotPassword = (email: string) =>
  API.post("/auth/forgot-password", { email });

export const resetPassword = (token: string, newPassword: string) =>
  API.post("/auth/reset-password", { token, newPassword });

export const verifyToken = (token: string) =>
  API.post("/auth/verify-token", { token });

// USER
export const getUserProfile = () => API.get("/user/me");

export const updateUserProfile = (data: { name?: string; email?: string }) =>
  API.patch("/user/update", data);

export const updateUserPassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => API.patch("/user/password", data);

export const deleteUserAccount = () => API.delete("/user/delete");

export const updateAddress = (data: any) => API.patch("/user/address", data);

export const updateRecentCity = (city: string) =>
  API.patch("/user/recent-city", { city });

// WEATHER
export const getWeatherByCity = (city: string) =>
  API.get("/weather", { params: { city } });

export const getForecastByCity = (city: string) =>
  API.get("/weather/forecast", { params: { city } });

export const getWeatherByCoords = (lat: number, lon: number) =>
  API.get("/weather/by-coords", { params: { lat, lon } });

export const getWeatherAlerts = (city: string) =>
  API.get("/weather/alerts", { params: { city } });

export const getAirQuality = (city: string) =>
  API.get("/weather/air-quality", { params: { city } });

// FAVORITES
export const getFavorites = () => API.get("/favorites");

export const getFavoritesPaginated = (page = 1, limit = 10) =>
  API.get("/favorites/paginated", { params: { page, limit } });

export const addFavorite = (data: { name: string; country: string }) =>
  API.post("/favorites", data);

export const deleteFavorite = (id: string) => API.delete(`/favorites/${id}`);

// LOGS
export const addSearchLog = (data: {
  location: string;
  temperature: number;
  condition: string;
}) => API.post("/logs", data);

export const getSearchLogs = (page = 1, limit = 10) =>
  API.get("/logs", { params: { page, limit } });

export const deleteSearchLog = (id: string) => API.delete(`/logs/${id}`);

export const clearSearchLogs = () => API.delete("/logs");

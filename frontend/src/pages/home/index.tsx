import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./home.module.css";

const Home = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (query: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${import.meta.env}weather`, {
        params: {
          city: query,
        },
      });
      setWeatherData(res.data);
    } catch (err) {
      setError("Cidade não encontrada.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoading(true);
          setError("");
          const res = await axios.get(`${import.meta.env}weather`, {
            params: {
              lat: latitude,
              lon: longitude,
            },
          });
          setWeatherData(res.data);
          setCity(res.data.name);
        } catch {
          setError("Erro ao buscar o clima pela localização.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permissão de localização negada.");
      }
    );
  };

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      fetchWeather(search);
      setCity(search);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Weather App</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Buscar cidade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {weatherData && (
        <div className={styles.card}>
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p>
            {weatherData.weather[0].description} - {Math.round(weatherData.main.temp)}°C
          </p>
          <p>Umidade: {weatherData.main.humidity}%</p>
          <p>Vento: {weatherData.wind.speed} km/h</p>
          <p>Coordenadas: {weatherData.coord.lat}, {weatherData.coord.lon}</p>
          <p>Sensação térmica: {Math.round(weatherData.main.feels_like)}°C</p>
        </div>
      )}
    </div>
  );
};

export default Home;

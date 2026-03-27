"use client";

import { useEffect, useMemo, useState } from "react";
import { CloudSun, Droplets, Wind } from "lucide-react";

interface DestinationWeatherProps {
  lat: number;
  lng: number;
  name: string;
  locale?: "en" | "zh" | "es";
}

interface OpenMeteoCurrent {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

const weatherCodeLabelEn: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

const weatherCodeLabelZh: Record<number, string> = {
  0: "晴朗",
  1: "大致晴朗",
  2: "局部多云",
  3: "阴天",
  45: "有雾",
  48: "雾凇",
  51: "小毛毛雨",
  53: "中等毛毛雨",
  55: "浓毛毛雨",
  56: "冻毛毛雨",
  57: "强冻毛毛雨",
  61: "小雨",
  63: "中雨",
  65: "大雨",
  66: "冻雨",
  67: "强冻雨",
  71: "小雪",
  73: "中雪",
  75: "大雪",
  77: "冰粒",
  80: "小阵雨",
  81: "中阵雨",
  82: "强阵雨",
  85: "小阵雪",
  86: "强阵雪",
  95: "雷暴",
  96: "伴冰雹雷暴",
  99: "强冰雹雷暴",
};

const weatherCodeLabelEs: Record<number, string> = {
  0: "Cielo despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia fuerte",
  66: "Lluvia helada",
  67: "Lluvia helada fuerte",
  71: "Nieve ligera",
  73: "Nieve moderada",
  75: "Nieve fuerte",
  77: "Granizo fino",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos fuertes",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve fuertes",
  95: "Tormenta",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo fuerte",
};

export default function DestinationWeather({
  lat,
  lng,
  name,
  locale = "en",
}: DestinationWeatherProps) {
  const [current, setCurrent] = useState<OpenMeteoCurrent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      try {
        setLoading(true);
        setError("");
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Weather service unavailable");
        const data = await res.json();

        if (isMounted && data?.current_weather) {
          setCurrent({
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            weathercode: data.current_weather.weathercode,
          });
        }
      } catch {
        if (isMounted) setError("Unable to fetch weather right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  const condition = useMemo(() => {
    if (!current) return "";
    const labels =
      locale === "zh"
        ? weatherCodeLabelZh
        : locale === "es"
          ? weatherCodeLabelEs
          : weatherCodeLabelEn;
    return (
      labels[current.weathercode] ||
      (locale === "zh" ? "当前天气" : locale === "es" ? "Condiciones actuales" : "Current conditions")
    );
  }, [current, locale]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="mb-1 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
        {locale === "zh" ? "当前天气" : locale === "es" ? "Tiempo actual" : "Current Weather"}
      </p>
      <p className="mb-3 text-sm text-zinc-300">{name}</p>

      {loading && (
        <p className="text-sm text-zinc-400">
          {locale === "zh"
            ? "天气加载中..."
            : locale === "es"
              ? "Cargando clima..."
              : "Loading weather..."}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-300">
          {locale === "zh"
            ? "暂时无法获取天气信息。"
            : locale === "es"
              ? "No se pudo obtener el clima por ahora."
              : error}
        </p>
      )}

      {current && (
        <div className="grid gap-2 text-sm text-zinc-200 sm:grid-cols-3">
          <p className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2">
            <CloudSun className="h-4 w-4 text-primary" />
            {condition}
          </p>
          <p className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2">
            <Droplets className="h-4 w-4 text-primary" />
            {current.temperature}°C
          </p>
          <p className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2">
            <Wind className="h-4 w-4 text-primary" />
            {current.windspeed} km/h
          </p>
        </div>
      )}
    </div>
  );
}

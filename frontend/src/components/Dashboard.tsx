"use client";

import { useEffect, useState } from "react";
import { generateForecast, fetchHistory, ForecastEvaluation } from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { format } from "date-fns";
import { CloudRain, Wind, Thermometer, TrendingUp, DollarSign, Activity } from "lucide-react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [data, setData] = useState<ForecastEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const history = await fetchHistory();
      setData(history.reverse().slice(-7)); // Last 7 days forecast for chart
    } catch (err) {
      setError("Unable to connect to the backend. Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError("");
      await generateForecast();
      await loadData();
    } catch (err) {
      setError("Failed to generate new forecast.");
    } finally {
      setGenerating(false);
    }
  };

  const chartData = data.map(d => ({
    name: format(new Date(d.target_date), "MMM dd"),
    Multiplier: d.recommended_fleet_investment_multiplier,
    Investment: d.total_investment,
    Rain: d.precipitation,
    Temp: d.temperature,
    Wind: d.wind_speed,
  }));

  const latest = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className={styles.container}>
      <div className={styles.maxW}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Rappi Fleet Investment</h1>
            <p className={styles.subtitle}>AI-Driven connection capacity forecaster based on weather data.</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className={styles.generateBtn}
          >
            {generating ? <Activity className="animate-spin" size={20} /> : <TrendingUp size={20} />}
            {generating ? "Simulating..." : "Generate 7-Day Forecast"}
          </button>
        </header>

        {error && (
          <div className={styles.errorBox}>
            <Activity size={20} />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className={styles.loader}>
            <Activity className="animate-spin" size={32} />
          </div>
        ) : (
          <div>
            {latest && (
              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <DollarSign size={20} color="#34d399" />
                    <h3 className={styles.kpiTitle}>Investment Multiplier</h3>
                  </div>
                  <p className={styles.kpiValue}>{latest.recommended_fleet_investment_multiplier}x</p>
                  <p className={styles.kpiSub}>Target Date: {format(new Date(latest.target_date), "PP")}</p>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <CloudRain size={20} color="#60a5fa" />
                    <h3 className={styles.kpiTitle}>Precipitation</h3>
                  </div>
                  <p className={styles.kpiValue}>{latest.precipitation} mm</p>
                  <p className={styles.kpiSub}>Adds +0.5x if &gt; 20mm</p>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <Thermometer size={20} color="#fb923c" />
                    <h3 className={styles.kpiTitle}>Temperature</h3>
                  </div>
                  <p className={styles.kpiValue}>{latest.temperature} °C</p>
                  <p className={styles.kpiSub}>Extreme temps increase hazard</p>
                </div>

                <div className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <Wind size={20} color="#22d3ee" />
                    <h3 className={styles.kpiTitle}>Wind Speed</h3>
                  </div>
                  <p className={styles.kpiValue}>{latest.wind_speed} km/h</p>
                  <p className={styles.kpiSub}>High winds demand safety focus</p>
                </div>
              </div>
            )}

            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Investment Multiplier Trend</h3>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorMultiplier" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#a1a1aa'}} />
                      <YAxis stroke="#52525b" tick={{fill: '#a1a1aa'}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#f4f4f5' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="Multiplier" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMultiplier)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Weather Factors (Rain & Temp)</h3>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" tick={{fill: '#a1a1aa'}} />
                      <YAxis yAxisId="left" stroke="#52525b" tick={{fill: '#a1a1aa'}} />
                      <YAxis yAxisId="right" orientation="right" stroke="#52525b" tick={{fill: '#a1a1aa'}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#f4f4f5' }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="Rain" stroke="#60a5fa" strokeWidth={2} dot={{r: 4, fill: '#60a5fa'}} />
                      <Line yAxisId="right" type="monotone" dataKey="Temp" stroke="#f97316" strokeWidth={2} dot={{r: 4, fill: '#f97316'}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <footer className={styles.footer}>
              <p>Rappi AI Engineering Request | Stack: FastAPI, SQLite, Next.js, Recharts, Vanilla CSS</p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}

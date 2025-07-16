import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MachineEnergyChart({ date }) {
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (d) => {
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:8081/api/machines/energy-by-date?date=${formatDate(date)}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRawData(data);
      } catch (err) {
        setError(err.message);
        setRawData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  useEffect(() => {
    if (!rawData.length) {
      setChartData([]);
      return;
    }

    // Group data by machineName
    const grouped = {};
    rawData.forEach((item) => {
      if (!grouped[item.machineName]) grouped[item.machineName] = [];
      grouped[item.machineName].push(item);
    });

    const maxPoints = 10;

    // Fixed timestamps: 8 AM to 5 PM (10 points)
    const startHour = 8;
    const baseDate = new Date(date);
    baseDate.setHours(startHour, 0, 0, 0);

    const timestamps = [];
    for (let i = 0; i < maxPoints; i++) {
      timestamps.push(
        baseDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      baseDate.setHours(baseDate.getHours() + 1);
    }

    // Calculate sampling interval per machine (minimum 1)
    // Based on total rows per machine, NOT total rows overall to be more accurate
    const sampledByMachine = {};
    for (const [machineName, dataPoints] of Object.entries(grouped)) {
      const sortedData = [...dataPoints].sort(
        (a, b) => new Date(a.controlTime) - new Date(b.controlTime)
      );

      const interval = Math.max(1, Math.floor(sortedData.length / maxPoints));

      // Sample every 'interval' rows to get maxPoints values
      const sampled = [];
      for (let i = 0; i < maxPoints; i++) {
        const idx = i * interval;
        if (idx < sortedData.length) {
          sampled.push(sortedData[idx]);
        } else {
          sampled.push(null); // no data for this slot
        }
      }

      sampledByMachine[machineName] = sampled;
    }

    // Build final chart data aligned by fixed timestamps
    const finalData = [];
    for (let i = 0; i < maxPoints; i++) {
      const obj = { time: timestamps[i] };
      for (const [machineName, samples] of Object.entries(sampledByMachine)) {
        obj[machineName] = samples[i] ? samples[i].energyQuantity : 0;
      }
      finalData.push(obj);
    }

    setChartData(finalData);
  }, [rawData, date]);

  const machineNames =
    chartData.length > 0
      ? Object.keys(chartData[0]).filter((k) => k !== "time")
      : [];

  if (!date) return <p>Please select a date.</p>;
  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>Machine Energy from 8 AM to 6 PM ({formatDate(date)})</h3>
      <p>Total raw rows fetched: {rawData.length}</p>
      {chartData.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {machineNames.map((machine) => (
              <Line
                key={machine}
                type="monotone"
                dataKey={machine}
                stroke={
                  "#" +
                  ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")
                }
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

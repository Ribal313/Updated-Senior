import React, { useEffect, useState, useMemo } from "react";
import ChartistGraph from "react-chartist";
import PropTypes from "prop-types";

function SolarGeneratorPieChart({ date }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ solar: 0, generator: 0 });

  useEffect(() => {
    let isMounted = true; // to prevent state updates after unmount

    async function fetchWorkingHours() {
      try {
        setLoading(true);
        setError(null);
        
       const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const dateStr = `${year}-${month}-${day}`;
// yyyy-mm-dd
         
        const [solarRes, generatorRes] = await Promise.all([
          fetch(`http://localhost:8081/api/solarPanel/Usage_count?info=Solar&date=${dateStr}`),
          fetch(`http://localhost:8081/api/solarPanel/Usage_count?info=Generator&date=${dateStr}`),
         // console.log(dateStr)
        ]);

        if (!solarRes.ok || !generatorRes.ok) {
          throw new Error("Failed to fetch working hours");
        }

        const [solarText, generatorText] = await Promise.all([
          solarRes.text(),
          generatorRes.text(),
        ]);

        const solarHours = Math.max(0, parseFloat(solarText) || 0);
        const generatorHours = Math.max(0, parseFloat(generatorText) || 0);

        if (isMounted) {
          setData({ solar: solarHours, generator: generatorHours });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load energy usage data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWorkingHours();

    return () => {
      isMounted = false; // cleanup function
    };
  }, [date]);

  const { chartData, total } = useMemo(() => {
    const total = data.solar + data.generator;
    const solarPercent = total === 0 ? 50 : (data.solar / total) * 100;
    const generatorPercent = total === 0 ? 50 : (data.generator / total) * 100;

    return {
      total,
      chartData: {
        labels: [
          `Solar ${solarPercent.toFixed(1)}%`, 
          `Generator ${generatorPercent.toFixed(1)}%`
        ],
        series: [solarPercent, generatorPercent],
      }
    };
  }, [data]);

  if (loading) return <div className="chart-loading">Loading energy usage data...</div>;
  if (error) return (
    <div className="chart-error">
      <span className="error-icon">⚠️</span>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="energy-usage-chart ct-perfect-fourth">
      {total > 0 ? (
        <ChartistGraph 
          data={chartData} 
          type="Pie" 
          options={{
            donut: true,
            donutWidth: 60,
            startAngle: 270,
            total: 100,
            showLabel: true
          }}
        />
      ) : (
        <p className="no-data-message">No energy usage data available for this date</p>
      )}
    </div>
  );
}

SolarGeneratorPieChart.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export default SolarGeneratorPieChart;
import React, { useState, useEffect } from "react";
import ServerApi from "../../serverApi/axios";
import { Line, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { format } from "date-fns";
import { useRota } from "../../RotaContext";

const formatDate = (dateString, scope) => {
  if (scope === "months") {
    return format(new Date(dateString), "MM/yyyy");
  } else if (scope === "years") {
    return format(new Date(dateString), "yyyy");
  }
  return format(new Date(dateString), "dd/MM/yyyy");
};

const VenueStatistics = () => {
  const { selectedvenueID } = useRota();
  const [statisticsData, setStatisticsData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [scope, setScope] = useState("weeks");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await ServerApi.get(
          `api/v1/venue/venues/${selectedvenueID}`
        );
        setStatisticsData(response.data.venue.statistics);
      } catch (err) {
        console.error("Failed to fetch venue statistics", err);
      }
    };

    fetchStatistics();
  }, [selectedvenueID]);

  const generateChartData = (data, key, label) => {
    const aggregatedData = data.reduce((acc, item) => {
      const formattedDate = formatDate(item.weekStarting, scope);
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      acc[formattedDate] += item[key] || 0;
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const values = Object.values(aggregatedData);

    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          borderColor: "#4A90E2",
          backgroundColor: "rgba(74, 144, 226, 0.2)",
          borderWidth: 2,
        },
      ],
    };
  };

  const renderChart = (data, label, key) => {
    const chartData = generateChartData(data, key, label);

    return chartType === "line" ? (
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              title: {
                display: true,
                text: label.includes("Hours") ? "Hours" : "Cost (£)",
              },
            },
          },
        }}
      />
    ) : (
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              title: {
                display: true,
                text: label.includes("Hours") ? "Hours" : "Cost (£)",
              },
            },
          },
        }}
      />
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2 font-bold">Scope:</label>
          <select
            className="p-2 border rounded"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="weeks">Weekly</option>
            <option value="months">Monthly</option>
            <option value="years">Yearly</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-bold">Chart Type:</label>
          <select
            className="p-2 border rounded"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      <div className=" md:w-3/4  w-1/3 mx-auto">
        <h2 className="text-xl font-bold mb-2">Staff Costs</h2>
        {renderChart(statisticsData, "Staff Costs", "totalStaffCost")}
      </div>

      <div className=" md:w-3/4   w-1/3 mx-auto">
        <h2 className="text-xl font-bold mb-2">Staff Hours</h2>
        {renderChart(statisticsData, "Staff Hours", "totalStaffHours")}
      </div>

      <div className=" md:w-3/4   w-1/3 mx-auto">
        <h2 className="text-xl font-bold mb-2">Holiday Costs</h2>
        {renderChart(statisticsData, "Holiday Costs", "totalHolidayCost")}
      </div>
    </div>
  );
};

export default VenueStatistics;

import React, { useState, useEffect } from "react";
import ServerApi from "../../serverApi/axios";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  LineChart as LineChartIcon,
  Clock,
  DollarSign,
  Palmtree,
} from "lucide-react";

const formatDate = (dateString, scope) => {
  if (scope === "months") {
    return format(new Date(dateString), "MMM yyyy");
  } else if (scope === "years") {
    return format(new Date(dateString), "yyyy");
  }
  return format(new Date(dateString), "dd MMM");
};

const VenueStatistics = () => {
  const selectedVenueId = localStorage.getItem("selectedVenueID");
  const [statisticsData, setStatisticsData] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [scope, setScope] = useState("weeks");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await ServerApi.get(
          `api/v1/venue/venues/${selectedVenueId}`
        );
        setStatisticsData(response.data.venue.statistics);
      } catch (err) {
        console.error("Failed to fetch venue statistics", err);
      }
    };

    fetchStatistics();
  }, [selectedVenueId]);

  const generateChartData = (data, key) => {
    const aggregatedData = data.reduce((acc, item) => {
      const formattedDate = formatDate(item.weekStarting, scope);
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      acc[formattedDate] += item[key] || 0;
      return acc;
    }, {});

    return Object.entries(aggregatedData).map(([date, value]) => ({
      date,
      value: Number(value.toFixed(2)),
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white p-2 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            {payload[0].value.toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
            })}
          </p>
        </Card>
      );
    }
    return null;
  };

  const ChartCard = ({ title, icon: Icon, data, valuePrefix, valueSuffix }) => {
    const chartData = generateChartData(statisticsData, data);
    const CustomizedDot = (props) => {
      const { cx, cy } = props;
      return (
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="currentColor"
          className="text-primary"
        />
      );
    };

    return (
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
              {title}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="date" />
                  <YAxis
                    tickFormatter={(value) =>
                      `${valuePrefix || ""}${value}${valueSuffix || ""}`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="currentColor"
                    strokeWidth={2}
                    dot={<CustomizedDot />}
                    className="text-primary"
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="date" />
                  <YAxis
                    tickFormatter={(value) =>
                      `${valuePrefix || ""}${value}${valueSuffix || ""}`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="currentColor"
                    className="text-primary fill-primary"
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Venue Statistics</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weeks">Weekly</SelectItem>
              <SelectItem value="months">Monthly</SelectItem>
              <SelectItem value="years">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Tabs
            value={chartType}
            onValueChange={setChartType}
            className="w-[180px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="line" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Line
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Bar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Staff Costs"
          icon={DollarSign}
          data="totalStaffCost"
          valuePrefix="£"
        />
        <ChartCard
          title="Staff Hours"
          icon={Clock}
          data="totalStaffHours"
          valueSuffix="h"
        />
        <ChartCard
          title="Holiday Costs"
          icon={Palmtree}
          data="totalHolidayCost"
          valuePrefix="£"
        />
      </div>
    </div>
  );
};

export default VenueStatistics;

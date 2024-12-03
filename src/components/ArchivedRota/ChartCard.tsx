import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DollarSign, Clock, Palmtree } from "lucide-react";
import CustomTooltip from "./CustomToolTip";

interface ChartCardProps {
  title: string;
  icon: React.ElementType;
  data: { date: string; value: number }[];
  valuePrefix?: string;
  valueSuffix?: string;
  chartType: string;
  generateChartData: (data: any[], key: string) => any[];
  getFilteredStatistics: () => any[];
}

const ChartCard = ({
  title,
  icon: Icon,
  data,
  valuePrefix,
  valueSuffix,
  chartType,
  generateChartData,
  getFilteredStatistics,
}: ChartCardProps) => {
  const chartData = generateChartData(getFilteredStatistics(), data);

  const CustomizedDot = (props: any) => {
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
    <Card className="col-span-1 max-w-[700px]">
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
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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

export default ChartCard;

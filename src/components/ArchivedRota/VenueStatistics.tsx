import React, { useState, useEffect } from "react";
import ServerApi from "../../serverApi/axios";
import { format } from "date-fns";
import {
  LineChartIcon,
  BarChart3,
  Clock,
  DollarSign,
  Palmtree,
} from "lucide-react";

import useStatistics from "../../hooks/useStatistics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ChartCard from "./ChartCard";

// Define the types for the statistics data
interface VenueStatistics {
  weekStarting: string;
  totalStaffHours: number;
  totalStaffCost: number;
  totalHolidayDays: number;
  totalHolidayCost: number;
}

interface Venue {
  statistics: VenueStatistics[];
}

interface BusinessData {
  [venueId: string]: {
    venueName: string;
    statistics: VenueStatistics[];
  };
}

const VenueStatistics = () => {
  const [selectedVenueId, setSelectedVenueId] = useState("all");
  const [chartType, setChartType] = useState<string>("line");
  const [scope, setScope] = useState("weeks");

  const { businessData, loading, error } = useStatistics();

  console.log(businessData);

  const formatDate = (dateString: string, scope: string) => {
    const date = new Date(dateString);
    switch (scope) {
      case "weeks":
        return `Week ${date.getDate()}/${date.getMonth() + 1}`;
      case "months":
        return date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      case "years":
        return date.getFullYear().toString();
      default:
        return dateString;
    }
  };

  const getFilteredStatistics = () => {
    if (selectedVenueId === "all") {
      // Combine statistics from all venues
      const allStatistics: VenueStatistics[] = [];
      const allDates = new Set<string>();

      // Get all unique dates across all venues
      Object.values(businessData).forEach((venue: Venue) => {
        venue.statistics.forEach((stat) => {
          allDates.add(stat.weekStarting);
        });
      });

      // For each date, sum up the statistics from all venues
      Array.from(allDates)
        .sort()
        .forEach((date) => {
          const combinedStat = {
            weekStarting: date,
            totalStaffHours: 0,
            totalStaffCost: 0,
            totalHolidayDays: 0,
            totalHolidayCost: 0,
          };

          Object.values(businessData).forEach((venue) => {
            const venueStat = venue.statistics.find(
              (s) => s.weekStarting === date
            );
            if (venueStat) {
              combinedStat.totalStaffHours += venueStat.totalStaffHours;
              combinedStat.totalStaffCost += venueStat.totalStaffCost;
              combinedStat.totalHolidayDays += venueStat.totalHolidayDays;
              combinedStat.totalHolidayCost += venueStat.totalHolidayCost;
            }
          });

          allStatistics.push(combinedStat);
        });

      return allStatistics;
    } else {
      return businessData[selectedVenueId]?.statistics || [];
    }
  };

  const generateChartData = (
    data: VenueStatistics[],
    key: keyof VenueStatistics
  ) => {
    const aggregatedData = data.reduce(
      (acc: Record<string, number>, item: VenueStatistics) => {
        const formattedDate = formatDate(item.weekStarting, scope);
        if (!acc[formattedDate]) {
          acc[formattedDate] = 0;
        }
        acc[formattedDate] += item[key] || 0;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(aggregatedData).map(([date, value]) => ({
      date,
      value: Number(value.toFixed(2)),
    }));
  };
  const getVenueSelectionTitle = () => {
    if (selectedVenueId === "all") {
      return "All Venues";
    }
    return businessData[selectedVenueId]?.venueName || "Select Venue";
  };

  if (loading) return <h1>Loading venue statistics...</h1>;
  if (error) return <h1>Failed to fetch statistics. Please try again.</h1>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">
          {getVenueSelectionTitle()} Statistics
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              {Object.entries(businessData).map(([id, venue]) => (
                <SelectItem key={id} value={id}>
                  {venue.venueName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select time scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
              <SelectItem value="years">Years</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="staff" className="space-y-8">
        <TabsList>
          <TabsTrigger value="staff">Staff Cost</TabsTrigger>
          <TabsTrigger value="hours">Staff Hours</TabsTrigger>
          <TabsTrigger value="holidays">Holiday Costs</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ChartCard
            title="Staff Cost"
            icon={DollarSign}
            data="totalStaffCost"
            chartType={chartType}
            generateChartData={generateChartData}
            getFilteredStatistics={getFilteredStatistics}
          />
          <ChartCard
            title="Staff Hours"
            icon={Clock}
            data="totalStaffHours"
            chartType={chartType}
            generateChartData={generateChartData}
            getFilteredStatistics={getFilteredStatistics}
          />
          <ChartCard
            title="Holiday Costs"
            icon={Palmtree}
            data="totalHolidayCost"
            chartType={chartType}
            generateChartData={generateChartData}
            getFilteredStatistics={getFilteredStatistics}
          />
        </div>
      </Tabs>
    </div>
  );
};

export default VenueStatistics;

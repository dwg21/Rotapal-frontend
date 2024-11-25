import { Card } from "@/components/ui/card";
import { TooltipProps } from "recharts";

// Define your own custom type for the tooltip data.
type CustomTooltipProps = TooltipProps<number, string>;

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Card className="bg-white p-2 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-primary">
          {payload[0]?.value?.toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP",
          })}
        </p>
      </Card>
    );
  }
  return null;
};

export default CustomTooltip;

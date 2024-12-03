import React, { useState } from "react";
import VenueDetails from "./VenueDetails";
import VenuePermissions from "./VenuePermissions";
import PaymentDetails from "./PaymentDetails";
import { Building2, Users, CreditCard, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const Settings = () => {
  const [activeTab, setActiveTab] = useState("venue-details");

  const sections = [
    {
      id: "venue-details",
      label: "Venue Details",
      icon: Building2,
      component: <VenueDetails />,
    },
    {
      id: "permissions",
      label: "Venue Permissions",
      icon: Users,
      component: <VenuePermissions />,
    },
    {
      id: "payment",
      label: "Payment Details",
      icon: CreditCard,
      component: <PaymentDetails />,
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-[250px_1fr] gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold">Settings</h2>
              </div>
              <nav className="flex flex-col space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeTab === section.id ? "secondary" : "ghost"}
                      className="justify-between"
                      onClick={() => setActiveTab(section.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  );
                })}
              </nav>
            </div>
            <div className="border-l pl-6">
              {sections.find((section) => section.id === activeTab)?.component}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

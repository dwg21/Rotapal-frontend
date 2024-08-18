import React, { useState } from "react";
import VenueDetails from "./VenueDetails";
import VenuePermissions from "./VenuePermissions";
import PaymentDetails from "./PaymentDetails";
import { ArrowLeftIcon, ArrowRight } from "lucide-react";

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("VenueDetails");

  const sections = [
    {
      name: "VenueDetails",
      label: "Venue Details",
      component: <VenueDetails />,
    },
    {
      name: "VenuePermissions",
      label: "Venue Permissions",
      component: <VenuePermissions />,
    },
    {
      name: "PaymentDetails",
      label: "Payment Details",
      component: <PaymentDetails />,
    },
  ];

  const renderSection = () => {
    const selected = sections.find(
      (section) => section.name === selectedSection
    );
    return selected ? (
      selected.component
    ) : (
      <div>Select a section to view its settings</div>
    );
  };

  return (
    <div className=" md:flex gap-2 w-full">
      <div className=" m-6">
        <ul>
          {sections.map((section) => (
            <li
              key={section.name}
              onClick={() => setSelectedSection(section.name)}
              className="border  py-4 px-6 text-left hover:cursor-pointer flex justify-between w-full"
            >
              {section.label}
              <ArrowRight />
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 w-full border-red-400 ">{renderSection()}</div>
    </div>
  );
};

export default Settings;

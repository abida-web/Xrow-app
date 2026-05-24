import { Card } from "@/components/ui/card";
import { Edit3 } from "lucide-react";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <Card className="p-5">
        <div className="flex gap-2 items-center font-semibold">
          <span>Add store name</span>
          <Edit3 className="h-4 w-4" />
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

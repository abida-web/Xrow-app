import GeneralButton from "@/components/GeneralButton";
import { Card } from "@/components/ui/card";
import { Edit3, PlusCircle, TagIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeslug: string }>;
}) {
  const { storeslug } = await params;
  return {
    title: `${storeslug} | Dashboard`,
    description: `Manage your ${storeslug} store`,
  };
}

const DashboardPage = async ({
  params,
}: {
  params: Promise<{ storeslug: string }>;
}) => {
  const { storeslug } = await params;

  return (
    <div className="container mx-auto p-4">
      <Card className="p-5">
        <div className="flex gap-2 items-center font-semibold mb-4 group">
          <span>Store: {storeslug}</span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <Link
              href={`/dashboard/${storeslug}/new`}
              className="relative flex flex-col items-center gap-2 group"
            >
              {/* Top Card */}
              <Card className=" p-5 w-50 h-50 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ">
                <TagIcon className="w-12 h-12 text-gray-400" />
              </Card>

              {/* Two Bottom Cards - overlapping upward */}
              <div className="flex gap-4 -mt-42">
                <Card className=" p-5 w-50 h-50 flex items-center justify-center transform -rotate-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ">
                  <PlusCircle className="w-12 h-12 text-gray-400" />
                </Card>

                <Card className=" p-5 w-50 h-50 flex items-center justify-center transform rotate-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ">
                  <Edit3 className="w-12 h-12 text-gray-400" />
                </Card>
              </div>
            </Link>
            <Link
              href={`/dashboard/${storeslug}/new`}
              className="inline-block text-sm mt-5 border w-fit px-3 py-1 rounded-lg shadow shadow-olive-600 transition-all hover:bg-accent"
            >
              Add Product
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

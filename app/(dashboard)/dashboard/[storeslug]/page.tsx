import GeneralButton from "@/components/GeneralButton";
import { Card } from "@/components/ui/card";
import { Edit3, Image, PlusCircle, TagIcon } from "lucide-react";
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
    <div className="container mx-auto sm:p-4">
      <Card className="p-5">
        <div className="flex gap-2 items-center font-semibold mb-4 group">
          <span>Store: {storeslug}</span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit3 className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-10">
          <div className="flex flex-col">
            <Link
              href={`/dashboard/${storeslug}/new`}
              className="relative flex flex-col items-center gap-2 group"
            >
              {/* TOP CARD - Now styled as a Web Model */}
              <Card className="w-64 overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* Browser Chrome Bar */}
                <div className="bg-gray-100 px-3 py-2 border-b flex items-center gap-1.5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[9px] text-gray-500 bg-white px-2 py-0.5 rounded">
                      {storeslug}.com
                    </span>
                  </div>
                  <div className="w-3 h-3"></div> {/* Spacer */}
                </div>

                {/* Web Page Content */}
                <div className="p-3">
                  {/* Hero Section */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 mb-3">
                    <TagIcon className="w-8 h-8 text-white mx-auto mb-1" />
                    <p className="text-white text-xs text-center font-medium">
                      Store Dashboard
                    </p>
                  </div>

                  {/* Content Lines (like text on a webpage) */}
                  <div className="space-y-2">
                    <div className="h-1.5 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-1.5 bg-gray-200 rounded-full w-5/6"></div>
                  </div>

                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3">
                    <div className="bg-gray-50 rounded p-1.5 text-center">
                      <div className="text-xs font-semibold text-gray-700">
                        24
                      </div>
                      <div className="text-[9px] text-gray-400">Products</div>
                    </div>
                    <div className="bg-gray-50 rounded p-1.5 text-center">
                      <div className="text-xs font-semibold text-gray-700">
                        128
                      </div>
                      <div className="text-[9px] text-gray-400">Orders</div>
                    </div>
                    <div className="bg-gray-50 rounded p-1.5 text-center">
                      <div className="text-xs font-semibold text-gray-700">
                        $4.2k
                      </div>
                      <div className="text-[9px] text-gray-400">Revenue</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Two Bottom Cards - overlapping upward */}
              <div className="flex gap-4 -mt-32">
                <Card className="w-48 p-4 bg-white rounded-lg shadow-md transform -rotate-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                  <div className="flex flex-col items-center">
                    <PlusCircle className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-600">
                      New
                    </span>
                  </div>
                </Card>

                <Card className="w-48 p-4 bg-white rounded-lg shadow-md transform rotate-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                  <div className="flex flex-col items-center">
                    <Edit3 className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-xs font-medium text-gray-600">
                      Edit
                    </span>
                  </div>
                </Card>
              </div>
            </Link>
            <Link
              href={`/dashboard/${storeslug}/products/new`}
              className="text-sm bg-[#06102c] mt-15 text-white px-3 py-1 my-5 w-30 rounded-lg hover:bg-[#030d27] inline-flex items-center"
            >
              Add product
            </Link>
          </div>

          <div className="ml-20">
            <Card className="w-72 overflow-hidden border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group">
              {/* Browser bar */}
              <div className="bg-gray-50 px-3 py-2 border-b flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                <div className="flex-1 text-center text-[10px] text-gray-500">
                  localhost:3000
                </div>
              </div>

              {/* Page preview */}
              <div className="p-3">
                <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-white text-xs font-bold">
                    Hero Banner
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="w-10 h-10 bg-gray-100 rounded"></div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full w-1/2 mb-1"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </Card>
            <Link
              href={`/dashboard/${storeslug}/products/new`}
              className="text-sm bg-gray-200 shadow-sm border border-gray-300 text-black px-3 py-1 my-5 rounded-lg hover:bg-gray-300 inline-flex items-center"
            >
              Customize theme
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;

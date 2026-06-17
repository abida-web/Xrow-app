"use client";

import { getInventory } from "@/actions/inventory";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Warehouse } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const InventoryPage = () => {
  const [allInventories, setAllInventories] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const storeslug = String(params.storeslug);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory(storeslug);
        setAllInventories(data);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const router = useRouter();

  function handleViewInventory(productId: string) {
    const url = `/dashboard/${storeslug}/products/${productId}`;
    router.push(url);
  }

  if (loading) {
    return (
      <div>
        <h1 className="flex gap-2 items-center font-semibold text-xxl">
          <Warehouse size={20} />
          <span>Inventory</span>
        </h1>
        <Card className="py-3 mt-5">
          <div className="text-center py-8">Loading inventory...</div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="flex gap-2 items-center font-semibold text-xxl">
        <Warehouse size={20} />
        <span>Inventory</span>
      </h1>
      <Card className="py-3 mt-5">
        <Table>
          <TableHeader>
            <TableRow className="text-gray-800 bg-gray-100">
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Comming</TableHead>
              <TableHead>Comited </TableHead>
              <TableHead>onHand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInventories.map((inv: any) => (
              <TableRow
                onClick={() => handleViewInventory(inv.productId)} // Fixed: using inv.id
                key={`${inv.id}-${inv.locationId}`} // Unique key for each row
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="flex flex-col">
                  <span>{inv.productName}</span>
                  <span className="text-xs bg-gray-200 w-fit px-2 py-px rounded-full">
                    {inv.name}
                  </span>
                </TableCell>
                <TableCell>{inv.sku}</TableCell>

                <TableCell>{inv.available}</TableCell>
                <TableCell>{inv.comming}</TableCell>
                <TableCell>{inv.commited}</TableCell>
                <TableCell>{inv.onHand}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default InventoryPage;

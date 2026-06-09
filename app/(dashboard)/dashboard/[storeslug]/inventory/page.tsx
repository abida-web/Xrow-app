import { getInventory } from "@/actions/inventory";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Factory, Warehouse } from "lucide-react";
import React from "react";

const InventoryPage = async () => {
  const allInventories = await getInventory();
  return (
    <div>
      <h1 className="flex gap-2 items-center font-semibold text-xxl">
        <Warehouse size={20} />
        <span>Inventory</span>
      </h1>
      <Card
        className="py-3 mt-5
      "
      >
        <Table>
          <TableHeader>
            <TableRow className="text-gray-800 bg-gray-100">
              <TableHead className="w-12"></TableHead>

              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInventories.map((inv) => (
              <TableRow
                key={inv.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{inv.name}</TableCell>
                <TableCell>{inv.sku}</TableCell>
                <TableCell>{inv.inventoryQuantity}</TableCell>
                <TableCell>AFG{inv.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default InventoryPage;

import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";

import { Product } from "@/types";
import { ParamValue } from "next/dist/server/request/params";
import React from "react";

interface RowProps {
  product: Product;
  selectRow: Set<string>;
  storeslug: ParamValue;
  onCheckedChange: (checked: any) => void;
  visibleColumns: {
    product: boolean;
    status: boolean;
    inventory: boolean;
    category: boolean;
    channels: boolean;
    productType: boolean;
    vendor: boolean;
    created: boolean;
    updated: boolean;
    catalogs: boolean; // ✅ Add this
  };
}

const ProductTableRow = ({
  product,
  selectRow,
  storeslug,
  onCheckedChange,
  visibleColumns,
}: RowProps) => {
  const isSelected = selectRow.has(product.id);

  // ✅ Get catalogs from product (API already transforms catalogProducts to catalogs)
  const catalogs = product.catalogs || [];

  const getStatusBadge = () => {
    const statusConfig: Record<string, { class: string; label: string }> = {
      active: { class: "bg-green-100 text-green-700", label: "Active" },
      draft: { class: "bg-yellow-100 text-yellow-700", label: "Draft" },
      archived: { class: "bg-gray-100 text-gray-700", label: "Archived" },
      out_of_stock: { class: "bg-red-100 text-red-700", label: "Out of Stock" },
    };

    const config = statusConfig[product.status] || {
      class: "bg-gray-100 text-gray-700",
      label: product.status || "Unknown",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.class}`}
      >
        {config.label}
      </span>
    );
  };
  const getInventoryText = () => {
    const firstVariant = product.variants?.[0];
    const quantity = firstVariant?.inventoryQuantity;

    if (quantity === undefined || quantity === null) return "N/A";
    if (quantity === 0) return "Out of stock";
    if (quantity < 10) return `${quantity} in stock (low)`;
    return `${quantity} in stock`;
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <TableRow
      data-state={isSelected ? "selected" : undefined}
      className="hover:bg-gray-50 transition-colors text-xs"
    >
      <TableCell className="w-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onCheckedChange}
          aria-label={`Select ${product.name}`}
        />
      </TableCell>

      {visibleColumns.product && (
        <TableCell className="font-medium">
          <div className="flex items-center gap-3 min-w-[200px]">
            {product.images?.[0]?.url && (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-10 h-10 rounded-md object-cover bg-gray-100 flex-shrink-0"
                loading="lazy"
              />
            )}
            <span className="line-clamp-2 break-words">{product.name}</span>
          </div>
        </TableCell>
      )}

      {visibleColumns.status && <TableCell>{getStatusBadge()}</TableCell>}

      {visibleColumns.inventory && (
        <TableCell className="whitespace-nowrap">
          <span
            className={
              product.variants?.[0]?.inventoryQuantity === 0
                ? "text-red-600"
                : ""
            }
          >
            {getInventoryText()}
          </span>
        </TableCell>
      )}

      {visibleColumns.category && (
        <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
      )}

      {visibleColumns.productType && (
        <TableCell>{product.productType || "—"}</TableCell>
      )}

      {visibleColumns.vendor && <TableCell>{product.vendor || "—"}</TableCell>}

      {visibleColumns.created && (
        <TableCell className="text-right whitespace-nowrap text-muted-foreground">
          {formatDate(product.createAt)}
        </TableCell>
      )}

      {visibleColumns.updated && (
        <TableCell className="text-right whitespace-nowrap text-muted-foreground">
          {formatDate(product.updatedAt)}
        </TableCell>
      )}

      {/* ✅ Add Catalogs Column */}
      {visibleColumns.catalogs && (
        <TableCell>
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {catalogs.length > 0 ? (
              catalogs.map((catalog: any) => (
                <span
                  key={catalog.id}
                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-100"
                >
                  {catalog.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default ProductTableRow;

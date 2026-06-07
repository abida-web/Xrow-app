import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types";
import { ParamValue } from "next/dist/server/request/params";
import React from "react";

interface RowProps {
  product: Product;
  selectRow: Set<string>;
  storeslug: ParamValue;
  onCheckedChange: (checked: boolean) => void;
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
    catalogs: boolean;
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
  const catalogs = product.catalogs || [];

  // Helper function to parse inventory quantity safely
  const parseInventoryQuantity = (
    value: string | number | undefined | null,
  ): number | null => {
    if (value === undefined || value === null || value === "") return null;
    const parsed = typeof value === "string" ? parseInt(value, 10) : value;
    return isNaN(parsed) ? null : parsed;
  };

  // Memoized inventory text to prevent recalculation on every render
  const inventoryText = React.useMemo(() => {
    const firstVariant = product.variants?.[0];
    const rawQuantity = firstVariant?.inventoryQuantity;
    const quantity = parseInventoryQuantity(rawQuantity);

    if (quantity === null) return "N/A";
    if (quantity === 0) return "Out of stock";
    if (quantity < 10) return `${quantity} in stock (low)`;
    return `${quantity} in stock`;
  }, [product.variants?.[0]?.inventoryQuantity]);

  // Memoized inventory status for styling
  const inventoryStatus = React.useMemo(() => {
    const firstVariant = product.variants?.[0];
    const rawQuantity = firstVariant?.inventoryQuantity;
    const quantity = parseInventoryQuantity(rawQuantity);

    if (quantity === null) return "unknown";
    if (quantity === 0) return "out_of_stock";
    if (quantity < 10) return "low_stock";
    return "in_stock";
  }, [product.variants?.[0]?.inventoryQuantity]);

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

  // Get inventory cell styling
  const getInventoryClassName = () => {
    switch (inventoryStatus) {
      case "out_of_stock":
        return "text-red-600 font-medium";
      case "low_stock":
        return "text-yellow-600 font-medium";
      case "in_stock":
        return "text-green-600";
      default:
        return "text-gray-500";
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
                onError={(e) => {
                  // Handle image load error
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="line-clamp-2 break-words">{product.name}</span>
          </div>
        </TableCell>
      )}

      {visibleColumns.status && <TableCell>{getStatusBadge()}</TableCell>}

      {visibleColumns.inventory && (
        <TableCell className="whitespace-nowrap">
          <span className={getInventoryClassName()}>{inventoryText}</span>
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

      {visibleColumns.catalogs && (
        <TableCell>
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {catalogs.length > 0 ? (
              catalogs.map((catalog: any) => (
                <span
                  key={catalog.id}
                  className="inline-flex px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  title={catalog.name}
                >
                  {catalog.name.length > 20
                    ? `${catalog.name.substring(0, 20)}...`
                    : catalog.name}
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

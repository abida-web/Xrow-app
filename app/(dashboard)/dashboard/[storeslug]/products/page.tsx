"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Columns, Eye, EyeOff, Filter, Table2, Tag, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import ProductTableRow from "@/app/(dashboard)/_components/ProductTableRow";
import { useProductFilter } from "@/stores/products-filter";
import { useParams } from "next/navigation";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLUMNS } from "@/app/constants/services";

const ProductsPage = () => {
  const { storeslug } = useParams();
  const {
    products,
    setProducts,
    selectedStatus,
    setSelectedStatus,
    vendor,
    setVendor,
    search,
    setSearch,
    productType,
    setProductType,
    page,
    setPage,
    selectedCategory,
    setSelectedCategory,
  } = useProductFilter();
  const [selectRow, setSelectRow] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    product: true,
    status: true,
    inventory: true,
    category: true,
    channels: true,
    productType: true,
    vendor: true,
    created: true,
    updated: true,
  });

  const toggleColumnVisible = (columnId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId as keyof typeof prev],
    }));
  };

  useEffect(() => {
    if (!storeslug) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const vendorParam = Array.isArray(vendor) ? vendor.join(",") : vendor;
        const productTypeParam = Array.isArray(productType)
          ? productType.join(",")
          : productType;
        const categoryParam = Array.isArray(selectedCategory)
          ? selectedCategory.join(",")
          : selectedCategory;

        const queryParams = new URLSearchParams({
          status: selectedStatus,
          vendor: vendorParam || "",
          productType: productTypeParam || "",
          category: categoryParam || "",
          search: search || "",
          page: page.toString(),
        });

        const res = await fetch(
          `/api/dashboard/${storeslug}/products?${queryParams.toString()}`,
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    storeslug,
    selectedStatus,
    vendor,
    productType,
    selectedCategory,
    search,
    page,
    setProducts,
  ]);

  const statuses = useMemo(
    () => ["all", ...new Set(products.map((p: any) => p.status))],
    [products],
  );

  const vendors = useMemo(
    () => [...new Set(products.map((p: any) => p.vendor).filter(Boolean))],
    [products],
  );

  const productTypes = useMemo(
    () => [...new Set(products.map((p: any) => p.productType).filter(Boolean))],
    [products],
  );

  const categories = useMemo(
    () => [
      ...new Set(products.map((p: any) => p.category?.name).filter(Boolean)),
    ],
    [products],
  );

  const selectAll = useMemo(
    () => selectRow.size === products.length && products.length > 0,
    [selectRow.size, products.length],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked === true) {
        setSelectRow(new Set(products.map((p: any) => p.id)));
      } else {
        setSelectRow(new Set());
      }
    },
    [products],
  );

  const handleSelectRows = useCallback(
    (id: string, checked: boolean | "indeterminate") => {
      setSelectRow((prev) => {
        const newSelected = new Set(prev);
        if (checked === true) {
          newSelected.add(id);
        } else {
          newSelected.delete(id);
        }
        return newSelected;
      });
    },
    [],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 py-4">
          <Tag size={18} />
          <span className="text-xl font-semibold">Products</span>
          {selectRow.size > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              ({selectRow.size} selected)
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns size={16} />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {COLUMNS.map((column) => (
                <DropdownMenuItem key={column.id} className="p-0">
                  <button
                    onClick={() => toggleColumnVisible(column.id)}
                    className="flex items-center justify-between w-full px-2 py-1.5 hover:bg-accent rounded-sm"
                  >
                    <span>{column.label}</span>
                    {visibleColumns[
                      column.id as keyof typeof visibleColumns
                    ] ? (
                      <Eye size={14} className="text-gray-500" />
                    ) : (
                      <EyeOff size={14} className="text-gray-500" />
                    )}
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href={`/dashboard/${storeslug}/products/new`}
            className="text-sm bg-[#06102c] text-white px-3 py-1 rounded-lg hover:bg-[#030d27] inline-flex items-center"
          >
            Add product
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex gap-3 items-center">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "all"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>

            <button
              onClick={() => setOpenFilterDropdown(!openFilterDropdown)}
              className={`p-2 rounded-lg transition-colors ${
                openFilterDropdown ||
                (vendor && vendor.length > 0) ||
                (productType && productType.length > 0) ||
                (selectedCategory && selectedCategory.length > 0)
                  ? "bg-[#06102c] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {openFilterDropdown ? <X size={18} /> : <Filter size={18} />}
            </button>
          </div>

          {openFilterDropdown && (
            <div className="mt-4 pt-4 border-t gap-5 flex flex-col md:flex-row items-center">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter by Vendor
                </label>
                <Combobox
                  value={vendor}
                  onValueChange={setVendor}
                  multiple
                  autoHighlight
                  items={vendors}
                >
                  <ComboboxChips className="w-full">
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Select vendors..." />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent>
                    <ComboboxEmpty>No vendors found.</ComboboxEmpty>
                    <ComboboxList>
                      {vendors.map((item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter by Product Type
                </label>
                <Combobox
                  value={productType}
                  onValueChange={setProductType}
                  multiple
                  autoHighlight
                  items={productTypes}
                >
                  <ComboboxChips className="w-full">
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Select product types..." />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent>
                    <ComboboxEmpty>No product types found.</ComboboxEmpty>
                    <ComboboxList>
                      {productTypes.map((item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Filter by Category
                </label>
                <Combobox
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  multiple
                  autoHighlight
                  items={categories}
                >
                  <ComboboxChips className="w-full">
                    <ComboboxValue>
                      {(values) => (
                        <>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>{value}</ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Select categories..." />
                        </>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent>
                    <ComboboxEmpty>No categories found.</ComboboxEmpty>
                    <ComboboxList>
                      {categories.map((item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableCaption className="text-xs text-gray-500">
              {loading
                ? "Loading products..."
                : products.length === 0
                  ? "No products found"
                  : `Showing ${products.length} products`}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                {visibleColumns.product && (
                  <TableHead className="text-xs font-semibold">
                    Product
                  </TableHead>
                )}
                {visibleColumns.status && (
                  <TableHead className="text-xs font-semibold">
                    Status
                  </TableHead>
                )}
                {visibleColumns.inventory && (
                  <TableHead className="text-xs font-semibold">
                    Inventory
                  </TableHead>
                )}
                {visibleColumns.category && (
                  <TableHead className="text-xs font-semibold">
                    Category
                  </TableHead>
                )}
                {visibleColumns.channels && (
                  <TableHead className="text-xs font-semibold">
                    Channels
                  </TableHead>
                )}
                {visibleColumns.productType && (
                  <TableHead className="text-xs font-semibold">
                    Product type
                  </TableHead>
                )}
                {visibleColumns.vendor && (
                  <TableHead className="text-xs font-semibold">
                    Vendor
                  </TableHead>
                )}
                {visibleColumns.created && (
                  <TableHead className="text-right text-xs font-semibold">
                    Created
                  </TableHead>
                )}
                {visibleColumns.updated && (
                  <TableHead className="text-right text-xs font-semibold">
                    Updated
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  selectRow={selectRow}
                  onCheckedChange={(checked) =>
                    handleSelectRows(product.id, checked)
                  }
                  storeslug={storeslug}
                  visibleColumns={visibleColumns}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {products.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No products found with the selected filter.
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

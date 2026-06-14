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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Columns, Eye, EyeOff, Filter, Tag, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import ProductTableRow from "@/app/(dashboard)/_components/ProductTableRow";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLUMNS } from "@/app/constants/services";
import ProductFilters from "@/app/(dashboard)/_components/ProductFilters";
import ProductDropDown from "@/app/(dashboard)/_components/ProductDropDown";
import { useProductsStore } from "@/stores/product-functions";

const ProductsPage = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);

  // Get all state and actions from the products store
  const {
    // State
    products,
    loading,
    selectedStatus,
    search,
    selectedCategory,
    vendor,
    productType,
    page,
    openFilterDropdown,
    selectRow,
    visibleColumns,
    catalogs,
    collections,

    // Computed
    getStatuses,
    getVendors,
    getProductTypes,
    getCategories,
    getSelectAll,

    // Actions
    setSelectedStatus,
    setSearch,
    setSelectedCategory,
    setVendor,
    setProductType,
    setPage,
    setOpenFilterDropdown,

    fetchProducts,
    handleSelectAll,
    handleSelectRows,
    bulkDeleteProducts,
    handleProductStatusUpdate,
    handleSalesChannelsStatusUpdate,
    fetchCatalogs,
    handleAssignProductToCatalog,
    handleExcludeProductFromCatalog,
    toggleColumnVisible,
    fetchCollections,
    handleAssignProductToCollection,
    handleRemoveProductFromCollections,
  } = useProductsStore();

  // Fetch products when dependencies change
  useEffect(() => {
    if (!storeslug) return;
    fetchProducts(storeslug);
  }, [
    storeslug,
    selectedStatus,
    vendor,
    productType,
    selectedCategory,
    search,
    page,
    fetchProducts,
  ]);
  useEffect(() => {
    if (!storeslug) return;
    fetchCollections(storeslug);
  }, [storeslug, fetchCollections]);

  // Fetch catalogs on mount
  useEffect(() => {
    if (!storeslug) return;
    fetchCatalogs(storeslug);
  }, [fetchCatalogs, storeslug]);

  const selectAll = getSelectAll();
  const statuses = getStatuses();
  const vendors = getVendors();
  const productTypes = getProductTypes();
  const categories = getCategories();

  const hasActiveFilters =
    vendor.length > 0 || productType.length > 0 || selectedCategory.length > 0;
  const nextPage = () => {
    setPage(page + 1);
  };
  const prevPage = () => {
    setPage(page - 1);
  };
  if (products.length < 0) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center ">
        <div className="text-5xl mt-20">🛍️</div>
        <h3 className="text-3xl">Your product list is empty</h3>
        <p className=" text-2xl">Get started by adding your first product</p>
        <Link
          className={"bg-black text-white px-5 py-1 rounded-sm"}
          href={`/dashboard/${storeslug}/products`}
        >
          + Add Product
        </Link>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 py-4">
          <Tag size={18} />
          <span className="text-xl font-semibold">Products</span>
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
                    onClick={() =>
                      toggleColumnVisible(
                        column.id as keyof typeof visibleColumns,
                      )
                    }
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
                openFilterDropdown || hasActiveFilters
                  ? "bg-[#06102c] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {openFilterDropdown ? <X size={18} /> : <Filter size={18} />}
            </button>
          </div>

          {openFilterDropdown && (
            <ProductFilters
              vendor={vendor}
              setVendor={setVendor}
              vendors={vendors}
              productType={productType}
              setProductType={setProductType}
              productTypes={productTypes}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableCaption className="text-xs text-gray-500">
              {products.length > 0 && (
                <div className="flex justify-between items-center p-4 border-t max-w-xl">
                  <Button
                    onClick={prevPage}
                    disabled={page === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">Page {page}</span>
                  <Button onClick={nextPage} variant="outline">
                    Next
                  </Button>
                </div>
              )}
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
                {selectRow.size > 0 ? (
                  <ProductDropDown
                    selectRow={selectRow}
                    handleSalesChannelsStatusUpdate={(status) =>
                      handleSalesChannelsStatusUpdate(status, storeslug)
                    }
                    handleProductStatusUpdate={(status) =>
                      handleProductStatusUpdate(status, storeslug)
                    }
                    bulkDeleteProducts={() => bulkDeleteProducts(storeslug)}
                    catalogs={catalogs}
                    collections={collections}
                    handleAssignProductToCatalog={(catalogId) =>
                      handleAssignProductToCatalog(catalogId, storeslug)
                    }
                    handleExcludeProductFromCatalog={(catalogId) =>
                      handleExcludeProductFromCatalog(catalogId, storeslug)
                    }
                    handleAssignProductToCollection={(colId) =>
                      handleAssignProductToCollection(colId, storeslug)
                    }
                    handleRemoveFromCollection={(collId) =>
                      handleRemoveProductFromCollections(collId, storeslug)
                    }
                  />
                ) : (
                  <>
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
                    {visibleColumns.catalogs && (
                      <TableHead className="text-xs font-semibold">
                        Catalogs
                      </TableHead>
                    )}
                  </>
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

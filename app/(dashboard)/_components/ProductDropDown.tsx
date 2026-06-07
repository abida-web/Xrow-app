"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableHead } from "@/components/ui/table";
import {
  CheckCircle,
  EyeOff,
  TrashIcon,
  FolderPlus,
  FolderMinus,
  Layers,
  Plus,
  X,
} from "lucide-react";
import CustomDialog from "@/app/(dashboard)/_components/CustomeDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CatalogProps, Collection } from "@/types";

interface ProductDropDownProps {
  selectRow: Set<string>;
  catalogs: CatalogProps[];
  collections: Collection[];
  handleSalesChannelsStatusUpdate: (status: boolean) => void;
  handleProductStatusUpdate: (status: string) => void;
  bulkDeleteProducts: () => void;
  handleAssignProductToCatalog: (catalogId: string) => Promise<void>;
  handleExcludeProductFromCatalog: (catalogId: string) => Promise<void>;
  handleAssignProductToCollection?: (collectionId: string) => Promise<void>;
  handleRemoveFromCollection?: (collectionId: string) => Promise<void>;
}

const ProductDropDown = ({
  selectRow,
  handleProductStatusUpdate,
  bulkDeleteProducts,
  handleSalesChannelsStatusUpdate,
  catalogs = [],
  collections = [],
  handleAssignProductToCatalog,
  handleExcludeProductFromCatalog,
  handleAssignProductToCollection,
  handleRemoveFromCollection,
}: ProductDropDownProps) => {
  // Safety checks
  const safeCatalogs = Array.isArray(catalogs) ? catalogs : [];
  const safeCollections = Array.isArray(collections) ? collections : [];

  return (
    <TableHead className="relative" colSpan={9}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium mr-2">
          {selectRow.size} selected
        </span>

        <CustomDialog
          trigger={
            <span className="text-xs px-2 border shadow py-1 rounded-sm hover:scale-105 duration-500 transition-all cursor-pointer">
              Set as draft
            </span>
          }
          title="Draft Products"
          description={`Are you sure you want to draft ${selectRow.size} product(s)? They will be set to draft status.`}
          buttonLabel="Draft"
          onConfirm={() => handleProductStatusUpdate("draft")}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="h-8">
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end">
            <DropdownMenuGroup>
              {/* Status Actions */}
              <CustomDialog
                trigger={
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Set as active
                  </div>
                }
                title="Active Products"
                description={`Are you sure you want to set ${selectRow.size} product(s) to active? They will be visible in your store.`}
                buttonLabel="Activate"
                onConfirm={() => handleProductStatusUpdate("active")}
              />

              <CustomDialog
                trigger={
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <EyeOff className="w-4 h-4 mr-2 text-gray-500" />
                    Set as unlisted
                  </div>
                }
                title="Unlist Products"
                description={`Are you sure you want to unlist ${selectRow.size} product(s)? They will be hidden from your store.`}
                buttonLabel="Unlist"
                onConfirm={() => handleProductStatusUpdate("unlisted")}
              />

              <DropdownMenuSeparator />

              {/* Sales Channel Actions */}
              <CustomDialog
                trigger={
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <div className="w-4 h-4 mr-2 rounded-full bg-green-500" />
                    Include in sales channel
                  </div>
                }
                title="Include in sales channels"
                description={`Are you sure you want to include ${selectRow.size} product(s) in sales? They will be visible in your sales channel.`}
                buttonLabel="Include"
                onConfirm={() => handleSalesChannelsStatusUpdate(true)}
              />

              <CustomDialog
                trigger={
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <div className="w-4 h-4 mr-2 rounded-full bg-gray-400" />
                    Exclude from sales channel
                  </div>
                }
                title="Exclude from sales channels"
                description={`Are you sure you want to exclude ${selectRow.size} product(s) from sales? They will be hidden from your sales channel.`}
                buttonLabel="Exclude"
                onConfirm={() => handleSalesChannelsStatusUpdate(false)}
              />

              <DropdownMenuSeparator />

              {/* Catalog Actions */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <FolderPlus className="w-4 h-4 mr-2 text-blue-600" />
                    Add to catalogs
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Add to catalogs</AlertDialogTitle>
                    <AlertDialogDescription>
                      Select a catalog to add {selectRow.size} selected
                      product(s) to.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  {safeCatalogs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No catalogs found.
                      </p>
                      <Button variant="link" size="sm" className="mt-2">
                        <a href="/catalogs/new">Create a catalog</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {safeCatalogs.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => handleAssignProductToCatalog(cat.id)}
                        >
                          <div>
                            <p className="font-medium text-sm">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {cat.catalogProducts?.length || 0} products
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <FolderMinus className="w-4 h-4 mr-2 text-red-600" />
                    Remove from catalogs
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove from catalogs</AlertDialogTitle>
                    <AlertDialogDescription>
                      Select a catalog to remove {selectRow.size} selected
                      product(s) from.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  {safeCatalogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No catalogs found.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {safeCatalogs.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() =>
                            handleExcludeProductFromCatalog(cat.id)
                          }
                        >
                          <div>
                            <p className="font-medium text-sm">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {cat.catalogProducts?.length || 0} products
                            </p>
                          </div>
                          <FolderMinus className="w-4 h-4 text-red-500" />
                        </div>
                      ))}
                    </div>
                  )}

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DropdownMenuSeparator />

              {/* Collection Actions */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <Layers className="w-4 h-4 mr-2 text-purple-600" />
                    Add to collections
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Add to collections</AlertDialogTitle>
                    <AlertDialogDescription>
                      Select a collection to add {selectRow.size} selected
                      product(s) to.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  {safeCollections.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No collections found.
                      </p>
                      <Button variant="link" size="sm" className="mt-2">
                        <a href="/collections/new">Create a collection</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {safeCollections.map((col) => (
                        <div
                          key={col.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() =>
                            handleAssignProductToCollection?.(col.id)
                          }
                        >
                          <div>
                            <p className="font-medium text-sm">{col.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {col.collectionProducts?.length || 0} products
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent w-full rounded-sm">
                    <X className="w-4 h-4 mr-2 text-red-600" />
                    Remove from collections
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove from collections</AlertDialogTitle>
                    <AlertDialogDescription>
                      Select a collection to remove {selectRow.size} selected
                      product(s) from.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  {safeCollections.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No collections found.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {safeCollections.map((col) => (
                        <div
                          key={col.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => handleRemoveFromCollection?.(col.id)}
                        >
                          <div>
                            <p className="font-medium text-sm">{col.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {col.collectionProducts?.length || 0} products
                            </p>
                          </div>
                          <X className="w-4 h-4 text-red-500" />
                        </div>
                      ))}
                    </div>
                  )}

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DropdownMenuSeparator />

              {/* Delete Action */}
              <CustomDialog
                trigger={
                  <div className="flex items-center px-2 py-2 text-sm text-red-600 cursor-pointer hover:bg-red-50 w-full rounded-sm">
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete products
                  </div>
                }
                title="Delete Products"
                description={`Are you sure you want to delete ${selectRow.size} product(s)? This action cannot be undone.`}
                buttonLabel="Delete"
                destructive={true}
                onConfirm={bulkDeleteProducts}
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableHead>
  );
};

export default ProductDropDown;

"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductsStore } from "@/stores/product-functions";
import { Tags, Upload, Loader2, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductStore } from "@/stores/product-create-store";
import { toast } from "sonner";
import { useCollectionFormStore } from "@/stores/collections-store";

interface CollectionFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: any;
  storeSlug: string;
}

const CollectionForm = ({
  onSubmit,
  isSubmitting = false,
  initialData,
  storeSlug,
}: CollectionFormProps) => {
  // Get all state and actions from store
  const formData = useCollectionFormStore((state) => state.formData);
  const updateField = useCollectionFormStore((state) => state.updateField);
  const setFormData = useCollectionFormStore((state) => state.setFormData);
  const resetForm = useCollectionFormStore((state) => state.resetForm);

  const search = useCollectionFormStore((state) => state.search);
  const setSearch = useCollectionFormStore((state) => state.setSearch);
  const openDialog = useCollectionFormStore((state) => state.openDialog);
  const setOpenDialog = useCollectionFormStore((state) => state.setOpenDialog);
  const selectedProducts = useCollectionFormStore(
    (state) => state.selectedProducts,
  );
  const setSelectedProducts = useCollectionFormStore(
    (state) => state.setSelectedProducts,
  );
  const imagePreview = useCollectionFormStore((state) => state.imagePreview);
  const setImagePreview = useCollectionFormStore(
    (state) => state.setImagePreview,
  );
  const uploading = useCollectionFormStore((state) => state.uploading);
  const setUploading = useCollectionFormStore((state) => state.setUploading);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store hooks
  const { fetchProducts, products } = useProductsStore();
  const { uploadImage } = useProductStore();

  // Load initial data if in edit mode, otherwise reset for create mode
  useEffect(() => {
    if (initialData) {
      // Edit mode - populate form with existing data
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "manual",
        publishedScope: initialData.publishedScope || "online",
        image: initialData.image || "",
      });
      setSelectedProducts(new Set(initialData.productIds || []));
      setImagePreview(initialData.image || "");
    } else {
      // Create mode - reset form to empty state
      resetForm();
    }
  }, [
    initialData,
    setFormData,
    setSelectedProducts,
    setImagePreview,
    resetForm,
  ]);

  // Load products on mount
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts(storeSlug);
    }
  }, [fetchProducts, products.length, storeSlug]);

  // Filter products based on search
  const filteredProducts =
    search.length > 0
      ? products.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase()),
        )
      : products;

  // Handle product selection
  const handleSelectProduct = useCallback(
    (productId: string) => {
      setSelectedProducts((prev) => {
        const newSelected = new Set(prev);
        if (newSelected.has(productId)) {
          newSelected.delete(productId);
        } else {
          newSelected.add(productId);
        }
        return newSelected;
      });
    },
    [setSelectedProducts],
  );

  // Handle adding products and closing dialog
  const handleAddProducts = useCallback(() => {
    setOpenDialog(false);
    setSearch("");
  }, [setOpenDialog, setSearch]);

  // Handle image upload
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setUploading(true);

      try {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          updateField("image", imageUrl);
          toast.success("Image uploaded successfully");
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        setImagePreview(initialData?.image || "");
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
        URL.revokeObjectURL(previewUrl);
      }
    },
    [
      uploadImage,
      updateField,
      setImagePreview,
      setUploading,
      initialData?.image,
    ],
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    const payload = {
      ...formData,
      productIds: Array.from(selectedProducts),
    };

    await onSubmit(payload);
  };

  const isLoading = isSubmitting || uploading;

  return (
    <div className="overflow-hidden">
      <h1 className="flex gap-2 items-center font-semibold">
        <Tags size={20} />
        <span>{initialData ? "Edit Collection" : "Add Collection"}</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[500px_1fr] md:grid-cols-[300px_1fr] grid-cols-1 gap-5 mt-3"
      >
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          {/* Basic Info Card */}
          <Card className="p-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Title *</Label>
                <Input
                  type="text"
                  placeholder="e.g. Summer collection, Under $100, Staff picks"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Description</Label>
                <Input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </Card>

          {/* Collection Type Card */}
          <Card className="p-3">
            <h1>Collection Type</h1>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: "manual" | "smart") =>
                updateField("type", value)
              }
              className="mt-3"
              disabled={isLoading}
            >
              <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                <div>
                  <p className="font-medium">Manual</p>
                  <p className="text-sm text-gray-500">
                    Add products to this collection one by one
                  </p>
                </div>
                <RadioGroupItem value="manual" id="manual" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Smart</p>
                  <p className="text-sm text-gray-500">
                    Automatically add products that match conditions
                  </p>
                </div>
                <RadioGroupItem value="smart" id="smart" />
              </div>
            </RadioGroup>
          </Card>

          {/* Products Card */}
          <Card className="p-3">
            <h1>Products</h1>
            <div className="flex items-center gap-5 mt-3">
              <Input
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading}
              />
              <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogTrigger asChild>
                  <Button type="button" disabled={isLoading}>
                    Browse
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Add products to collection
                    </AlertDialogTitle>
                  </AlertDialogHeader>

                  <div className="mt-4">
                    <Input
                      placeholder="Search products"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="mb-4"
                    />

                    <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border"
                            key={product.id}
                            onClick={() => handleSelectProduct(product.id)}
                          >
                            <Checkbox
                              checked={selectedProducts.has(product.id)}
                              onCheckedChange={() =>
                                handleSelectProduct(product.id)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            <img
                              src={
                                product?.images?.[0]?.url ||
                                "/placeholder-image.jpg"
                              }
                              className="h-12 w-12 rounded-sm object-cover"
                              alt={product.name}
                            />
                            <div className="flex-1">
                              <h1 className="font-medium">{product.name}</h1>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          {products.length === 0
                            ? "Loading products..."
                            : `No products found for "${search}"`}
                        </p>
                      )}
                    </div>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAddProducts}>
                      Add{" "}
                      {selectedProducts.size > 0
                        ? `(${selectedProducts.size})`
                        : ""}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Selected Products Display */}
            {selectedProducts.size > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                <Label className="text-sm font-medium">
                  Selected Products ({selectedProducts.size})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedProducts).map((productId) => {
                    const product = products.find((p) => p.id === productId);
                    return product ? (
                      <div
                        key={productId}
                        className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm"
                      >
                        <span>{product.name}</span>
                        <button
                          type="button"
                          onClick={() => handleSelectProduct(productId)}
                          className="text-red-500 hover:text-red-700 ml-1"
                          disabled={isLoading}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* Publishing Scope Card */}
          <Card className="p-3">
            <div className="flex flex-col gap-3">
              <h1>Publishing Scope</h1>
              <RadioGroup
                value={formData.publishedScope}
                onValueChange={(value: "online" | "pos" | "both") =>
                  updateField("publishedScope", value)
                }
                className="mt-3"
                disabled={isLoading}
              >
                <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                  <div>
                    <p className="font-medium">Online Store</p>
                    <p className="text-sm text-gray-500">
                      Available on online store
                    </p>
                  </div>
                  <RadioGroupItem value="online" id="online" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg mb-2">
                  <div>
                    <p className="font-medium">POS</p>
                    <p className="text-sm text-gray-500">
                      Only available on POS
                    </p>
                  </div>
                  <RadioGroupItem value="pos" id="pos" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Both</p>
                    <p className="text-sm text-gray-500">
                      Available on online store and POS
                    </p>
                  </div>
                  <RadioGroupItem value="both" id="both" />
                </div>
              </RadioGroup>
            </div>
          </Card>

          {/* Collection Image Card */}
          <Card className="p-3">
            <div className="flex flex-col gap-3">
              <h1>Collection Image</h1>
              <div className="flex flex-col items-center gap-4 mt-3">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Collection preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        updateField("image", "");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 w-6 h-6 flex items-center justify-center"
                      disabled={isLoading}
                    >
                      <X size={14} />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                {imagePreview && !uploading && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    Change Image
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : initialData ? (
              "Update Collection"
            ) : (
              "Save Collection"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;

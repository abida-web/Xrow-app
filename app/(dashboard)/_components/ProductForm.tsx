"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tags, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-create-store";
import { ImagesSection } from "./ImageSection";
import { generateSlug } from "@/modules/utils";
import { getAllCategories } from "@/actions/getCategories";
import { VariantsSection } from "./VarientSection";
import { Switch } from "@/components/ui/switch";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CategoryProps {
  id: string;
  name: string;
}

interface ProductFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting?: boolean;
  initialData?: any;
}

const ProductForm = ({
  onSubmit,
  isSubmitting,
  initialData,
}: ProductFormProps) => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const formData = useProductStore((state) => state.formData);
  const [tagInput, setTagInput] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const updateField = useProductStore((state) => state.updateField);
  const setFormData = useProductStore((state) => state.setFormData);
  const resetForm = useProductStore((state) => state.resetForm);
  const addTags = useProductStore((state) => state.addTag);
  const updateVariantInventoryLevels = useProductStore(
    (state) => state.updateVariantInventoryLevels,
  );
  const storeLocations = useProductStore((state) => state.storeLocations);
  const { isInventoryTracked, setIsInventoryTracked } = useProductStore();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      resetForm();
    }
  }, [initialData, setFormData, resetForm]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesList = await getAllCategories();
      setCategories(categoriesList);
    };
    fetchCategories();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      updateField(name as keyof typeof formData, value);

      if (name === "name") {
        updateField("slug", generateSlug(value));
      }
    },
    [updateField],
  );

  const handleAddTag = () => {
    if (tagInput.trim()) {
      addTags(tagInput);
      setTagInput("");
    }
  };

  const removeTag = useCallback(
    (tagToRemove: string) => {
      const updatedTags = formData.tags.filter((tag) => tag !== tagToRemove);
      updateField("tags", updatedTags);
    },
    [formData.tags, updateField],
  );

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categories, categorySearch]); // Added categorySearch dependency

  const handleCategorySelect = (value: string) => {
    setCategorySearch(value);
    const selectedCategory = categories.find((cat) => cat.name === value);
    if (selectedCategory) {
      updateField("categoryId", selectedCategory.id);
    }
  };

  const handleClearCategory = () => {
    updateField("categoryId", "");
    setCategorySearch("");
  };

  const tagsDisplay = useMemo(
    () =>
      formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-500 focus:outline-none"
                aria-label={`Remove tag ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ),
    [formData.tags, removeTag],
  );

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="w-full py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Tags size={20} />
          <span>{initialData ? "Edit Product" : "Create Product"}</span>
        </h1>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="p-5 space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm">
                  Title
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Short sleeve t-shirt"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-sm">
                  Slug
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="short-sleeve-t-shirt"
                  value={formData.slug || ""}
                  onChange={handleInputChange}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Product description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm">
                  Category
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="category"
                    list="categories-list"
                    placeholder="Search or select category..."
                    value={categorySearch}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="pr-20"
                  />
                  {formData.categoryId && (
                    <button
                      type="button"
                      onClick={handleClearCategory}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500 hover:text-red-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <datalist id="categories-list">
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                  ))}
                </datalist>

                {formData.categoryId && (
                  <p className="text-xs text-green-600 mt-2">
                    Selected:{" "}
                    {
                      categories.find((cat) => cat.id === formData.categoryId)
                        ?.name
                    }
                  </p>
                )}
              </div>
            </Card>

            {/* Images */}
            <ImagesSection />

            {/* Options Card */}
            <Card className="p-5">
              <div className="mb-3">
                <h3 className="font-medium">Options</h3>
                <p className="text-xs text-gray-500">
                  Size, Color, Material (max 3)
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  placeholder="Option 1 (e.g., Size)"
                  value={formData.option1Name || ""}
                  onChange={(e) => updateField("option1Name", e.target.value)}
                />
                <Input
                  placeholder="Option 2 (e.g., Color)"
                  value={formData.option2Name || ""}
                  onChange={(e) => updateField("option2Name", e.target.value)}
                />
                <Input
                  placeholder="Option 3 (e.g., Material)"
                  value={formData.option3Name || ""}
                  onChange={(e) => updateField("option3Name", e.target.value)}
                />
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Track inventory</h3>
                  <p className="text-xs text-gray-500">
                    {isInventoryTracked
                      ? "Stock levels will be monitored"
                      : "Inventory tracking is disabled"}
                  </p>
                </div>
                <Switch
                  checked={isInventoryTracked}
                  onCheckedChange={setIsInventoryTracked}
                />
              </div>

              {!isInventoryTracked && (
                <div className="mt-3 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                  ⚠️ Variants will be created without inventory quantities
                </div>
              )}
            </Card>

            {/* Variants */}
            <VariantsSection />
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            <Card className="p-5 space-y-4">
              <div>
                <Label htmlFor="productType" className="text-sm">
                  Product Type
                </Label>
                <Input
                  id="productType"
                  placeholder="Shoes, Clothes, Accessories"
                  value={formData.productType || ""}
                  onChange={(e) => updateField("productType", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="vendor" className="text-sm">
                  Vendor
                </Label>
                <Input
                  id="vendor"
                  placeholder="Nike, Dior, Pandora"
                  value={formData.vendor || ""}
                  onChange={(e) => updateField("vendor", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-sm">
                  Status
                </Label>
                <Select
                  value={formData.status || "draft"}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Enter tags"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                {tagsDisplay}
              </div>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#06102c] hover:bg-[#030d27]"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import { getAllCategories } from "@/actions/getCategories";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import { toast } from "sonner";
import { ImagesSection } from "@/app/(dashboard)/_components/ImageSection";
import { VariantsSection } from "@/app/(dashboard)/_components/VarientSection";
import { OptionsSection } from "@/app/(dashboard)/_components/OptionSection";
import { generateSlug } from "@/modules/utils";

interface CategoryProps {
  id: string;
  name: string;
}
const NewPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryProps[]>([]);

  // Selective subscriptions - only subscribe to what this component needs
  const formData = useProductStore((state) => state.formData);
  const setFormData = useProductStore((state) => state.setFormData);
  const updateField = useProductStore((state) => state.updateField);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesList = await getAllCategories();
      setCategories(categoriesList);
    };
    fetchCategories();
  }, []);

  // Optimized input handler with useCallback
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      // Use updateField for single field updates (more efficient)
      updateField(name as keyof typeof formData, value);
      
      // Auto-generate slug when name changes
      if (name === "name") {
        updateField("slug", generateSlug(value));
      }
    },
    [updateField],
  );

  // Optimized tags handler
  const handleTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const tagsArray = e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      updateField("tags", tagsArray);
    },
    [updateField],
  );

  // Optimized tag removal
  const removeTag = useCallback(
    (tagToRemove: string) => {
      const updatedTags = formData.tags.filter((tag) => tag !== tagToRemove);
      updateField("tags", updatedTags);
    },
    [formData.tags, updateField],
  );

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const res = await fetch("/api/dashboard/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Product Added successfully");
        router.push("/dashboard/products");
      } else {
        toast.error("Failed to add product");
      }
    },
    [formData, router],
  );

  // Memoize category select items
  const categoryItems = useMemo(
    () =>
      categories.map((cat) => (
        <SelectItem key={cat.id} value={cat.id}>
          {cat.name}
        </SelectItem>
      )),
    [categories],
  );

  // Memoize tags display
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
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ),
    [formData.tags, removeTag],
  );

  return (
    <div className="overflow-hidden">
      <h1 className="flex gap-2 items-center font-semibold">
        <Tags size={20} />
        <span>Collections</span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[600px_1fr] gap-5 mt-3"
      >
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          {/* Basic Info Card */}
          <Card className="p-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-sm">Title</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Short sleeve t-shirt"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm">Slug</Label>
                <Input
                  type="text"
                  name="slug"
                  placeholder="short-sleeve-t-shirt"
                  value={formData.slug}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-sm">Description</Label>
                <Textarea
                  name="description"
                  rows={5}
                  placeholder="Product description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <ImagesSection />

              <div className="flex flex-col gap-1">
                <Label className="text-sm">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => updateField("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>{categoryItems}</SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <VariantsSection />
          <OptionsSection />
        </div>

        {/* Right Column - Additional Info */}
        <Card className="p-5 h-fit w-70">
          <h3 className="font-medium mb-4">Additional Info</h3>

          <div className="flex flex-col gap-4">
            <div>
              <Label className="text-xs">Product Type</Label>
              <Input
                type="text"
                placeholder="Shoes, Clothes, Accessories"
                value={formData.productType}
                onChange={(e) => updateField("productType", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Vendor</Label>
              <Input
                type="text"
                placeholder="Nike, Dior, Pandora"
                value={formData.vendor}
                onChange={(e) => updateField("vendor", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateField("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-semibold mb-2">
                      Statuses
                    </SelectLabel>

                    <SelectItem value="active">
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-medium">Active</span>
                        <span className="text-xs text-gray-500">
                          Sell via selected sales channels and markets
                        </span>
                      </div>
                    </SelectItem>

                    <SelectItem value="draft">
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-medium">Draft</span>
                        <span className="text-xs text-gray-500">
                          Not visible on selected sales channels or markets
                        </span>
                      </div>
                    </SelectItem>

                    <SelectItem value="unlisted">
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-medium">Unlisted</span>
                        <span className="text-xs text-gray-500">
                          Accessible only by direct link
                        </span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Tags</Label>
              <Input
                type="text"
                placeholder="fashion, house, shoes"
                value={formData.tags.join(", ")}
                onChange={handleTagsChange}
              />
            </div>

            {tagsDisplay}
          </div>
        </Card>

        <Button
          type="submit"
          className="text-sm bg-[#06102c] text-white px-3 py-1 rounded hover:bg-[#030d27]"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default NewPage;

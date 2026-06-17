"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useProductStore } from "@/stores/product-create-store";
import { toast } from "sonner";
import { ImagesSection } from "@/app/(dashboard)/_components/ImageSection";
import { VariantsSection } from "@/app/(dashboard)/_components/VarientSection";

import { generateSlug } from "@/modules/utils";
import ProductForm from "@/app/(dashboard)/_components/ProductForm";
import { useProductsStore } from "@/stores/product-functions";

interface CategoryProps {
  id: string;
  name: string;
}
const NewPage = () => {
  const router = useRouter();
  const params = useParams();
  const storeslug = String(params.storeslug);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Selective subscriptions - only subscribe to what this component needs
  const formData = useProductStore((state) => state.formData);
  const setFormData = useProductStore((state) => state.setFormData);
  const updateField = useProductStore((state) => state.updateField);
  const isInventoryTracked = useProductStore(
    (state) => state.isInventoryTracked,
  );

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
      setIsSubmitting(true);
      const res = await fetch("/api/dashboard/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData, isInventoryTracked, storeslug }),
      });
      if (res.ok) {
        toast.success("Product Added successfully");
        setIsSubmitting(false);
      } else {
        toast.error("Failed to add product");
        setIsSubmitting(false);
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

  return <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};

export default NewPage;

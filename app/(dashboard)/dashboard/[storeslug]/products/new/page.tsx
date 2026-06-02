"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAllCategories } from "@/actions/getCategories";
import { useProductStore } from "@/stores/product-store";
import { toast } from "sonner";
import ProductForm from "@/app/(dashboard)/_components/ProductForm";

interface CategoryProps {
  id: string;
  name: string;
}

const NewPage = () => {
  const router = useRouter();
  const params = useParams();
  const { storeslug } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formData = useProductStore((state) => state.formData);

  const handleSubmit = useCallback(
    async (data: any) => {
      setIsSubmitting(true);

      try {
        const res = await fetch("/api/dashboard/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, storeSlug: storeslug }),
        });

        if (res.ok) {
          toast.success("Product created successfully");
          router.push(`/dashboard/${storeslug}/products`);
        } else {
          const error = await res.json();
          toast.error(error.message || "Failed to create product");
        }
      } catch (error) {
        console.error("Error creating product:", error);
        toast.error("An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, storeslug],
  );

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      // No initialData = create mode
    />
  );
};

export default NewPage;

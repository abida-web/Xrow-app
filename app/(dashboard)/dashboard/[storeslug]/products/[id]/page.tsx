"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProduct } from "@/actions/getProduct";
import ProductForm from "@/app/(dashboard)/_components/ProductForm";
import { toast } from "sonner";

const ProductEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const storeslug = String(params.storeslug);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(id as string, storeslug);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
        router.push(`/dashboard/${storeslug}/products`);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, storeslug, router]);

  const handleSubmit = useCallback(
    async (formData: any) => {
      setIsSubmitting(true);

      try {
        const res = await fetch(`/api/dashboard/product/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send the form data from the store
        });

        if (res.ok) {
          toast.success("Product updated successfully");
          router.push(`/dashboard/${storeslug}/products`);
        } else {
          const error = await res.json();
          toast.error(error.message || "Failed to update product");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, storeslug, router],
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 flex justify-center">
        <div className="text-gray-500">Loading product data...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-8 flex justify-center">
        <div className="text-red-500">Product not found</div>
      </div>
    );
  }

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      initialData={product}
    />
  );
};

export default ProductEditPage;

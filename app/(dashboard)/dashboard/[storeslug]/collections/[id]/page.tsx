"use client";
import { getCollection } from "@/actions/getCollection";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CollectionForm from "@/app/(dashboard)/_components/CollectionForm";
import { useProductStore } from "@/stores/product-create-store";
import { useProductsStore } from "@/stores/product-functions";
import { useCollectionStore } from "@/stores/collections-store";

interface FormattedCollectionData {
  name: string;
  description: string;
  type: "manual" | "smart";
  publishedScope: "online" | "pos" | "both";
  image: string;
  productIds: string[];
}

const CollectionEditPage = () => {
  const params = useParams();
  const { id, storeslug } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] =
    useState<FormattedCollectionData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { fetchCollections } = useProductsStore();
  const { updateCollection } = useCollectionStore();
  useEffect(() => {
    const fetchCollection = async () => {
      if (!id || typeof id !== "string") {
        toast.error("No collection ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const collectionData = await getCollection(id);

        const formattedCollection: FormattedCollectionData = {
          name: collectionData.name || "",
          description: collectionData.description || "",
          type: collectionData.type === "smart" ? "smart" : "manual",
          publishedScope:
            collectionData.publishedScope === "pos" ||
            collectionData.publishedScope === "both"
              ? collectionData.publishedScope
              : "online",
          image: collectionData.image || "",
          productIds: collectionData.productIds || [],
        };

        setInitialData(formattedCollection);
      } catch (error) {
        console.error("Error fetching collection:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load collection",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

  const handleUpdateCollection = async (formData: FormattedCollectionData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/dashboard/collections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the global store with the updated collection
        if (updateCollection) {
          updateCollection(id as string, {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            publishedScope: formData.publishedScope,
            image: formData.image,
            productIds: formData.productIds,
            // Include any other fields your collection object has
            updatedAt: new Date().toISOString(),
          });
        }

        // Optionally refresh the collections list
        if (fetchCollections) {
          await fetchCollections();
        }

        toast.success("Collection updated successfully");

        // Update local state (optional since we're redirecting)
        setInitialData({
          name: data.name || formData.name,
          description: data.description || formData.description,
          type: data.type || formData.type,
          publishedScope: data.publishedScope || formData.publishedScope,
          image: data.image || formData.image,
          productIds: data.productIds || formData.productIds,
        });

        // Redirect to collections list
        router.push(`/dashboard/${storeslug}/collections`);
        router.refresh(); // Optional: force a refresh of the server component
      } else {
        toast.error(data.message || "Failed to update collection");
      }
    } catch (error) {
      console.error("Error updating collection:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Collection not found</p>
        </div>
      </div>
    );
  }

  return (
    <CollectionForm
      initialData={initialData}
      onSubmit={handleUpdateCollection}
      isSubmitting={isSubmitting}
      storeSlug={storeslug as string}
    />
  );
};

export default CollectionEditPage;

"use client";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CollectionForm from "@/app/(dashboard)/_components/CollectionForm";

const NewCollection = () => {
  const params = useParams();
  const storeslug = String(params.storeslug);

  const handleCreateCollection = async (data: {
    name: string;
    description: string;
    type: "manual" | "smart";
    publishedScope: "online" | "pos" | "both";
    image: string;
    productIds: string[];
  }) => {
    const response = await fetch("/api/dashboard/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create collection");
    }

    toast.success("Collection created successfully");
  };

  return (
    <CollectionForm onSubmit={handleCreateCollection} storeSlug={storeslug} />
  );
};

export default NewCollection;

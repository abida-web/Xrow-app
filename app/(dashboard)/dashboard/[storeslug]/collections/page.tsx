"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductsStore } from "@/stores/product-functions";
import { FolderOpen, Plus, Loader2, Tags, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useCollectionStore } from "@/stores/collections-store";

const CollectionsPage = () => {
  const router = useRouter();
  const params = useParams();
  const storeslug = String(params.storeslug);
  const { collections, setCollections } = useProductsStore();
  const { deleteCollections, isDeleting } = useCollectionStore();

  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = () => {
    if (selectedCollections.size === filteredCollections.length) {
      setSelectedCollections(new Set());
    } else {
      setSelectedCollections(new Set(filteredCollections.map((col) => col.id)));
    }
  };

  const handleSelectCollection = (collectionId: string) => {
    const newSelected = new Set(selectedCollections);
    if (newSelected.has(collectionId)) {
      newSelected.delete(collectionId);
    } else {
      newSelected.add(collectionId);
    }
    setSelectedCollections(newSelected);
  };

  const handleDeleteSelected = async () => {
    const success = await deleteCollections(Array.from(selectedCollections));
    if (success) {
      toast.success(
        `${selectedCollections.size} collection(s) deleted successfully`,
      );
      setCollections(
        collections.filter((col) => !selectedCollections.has(col.id)),
      );
      setSelectedCollections(new Set());
    } else {
      toast.error("Failed to delete collections");
    }
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800">
            <FolderOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            No collections yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first collection to start organizing and saving your
            favorite items.
          </p>
          <Link
            href={`/dashboard/${storeslug}/collections/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#06102c] hover:bg-[#020819] text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Create your first collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="flex gap-2 items-center font-semibold text-2xl">
          <Tags size={24} />
          <span>Collections</span>
        </h1>
        <Link href={`/dashboard/${storeslug}/collections/new`}>
          <Button className="bg-[#06102c] hover:bg-[#020819]">
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedCollections.size === filteredCollections.length &&
                    filteredCollections.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollections.map((collection) => (
              <TableRow
                key={collection.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedCollections.has(collection.id)}
                    onCheckedChange={() =>
                      handleSelectCollection(collection.id)
                    }
                  />
                </TableCell>
                <TableCell
                  onClick={() =>
                    router.push(
                      `/dashboard/${storeslug}/collections/${collection.id}`,
                    )
                  }
                >
                  <img
                    src={collection.image || "/placeholder-image.jpg"}
                    alt={collection.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell
                  onClick={() =>
                    router.push(
                      `/dashboard/${storeslug}/collections/${collection.id}`,
                    )
                  }
                  className="font-medium"
                >
                  {collection.name}
                </TableCell>
                <TableCell
                  onClick={() =>
                    router.push(
                      `/dashboard/${storeslug}/collections/${collection.id}`,
                    )
                  }
                >
                  <span className="text-sm text-gray-500">
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCollections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              No collections found matching "{searchQuery}"
            </p>
          </div>
        )}

        {selectedCollections.size > 0 && (
          <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedCollections.size} collection(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Delete Selected"
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CollectionsPage;

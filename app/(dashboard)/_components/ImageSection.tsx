"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/stores/product-store";
import { useCallback } from "react";
export const ImagesSection = () => {
  const previewUrls = useProductStore((state) => state.previewUrls);
  const isLoading = useProductStore((state) => state.isLoading);
  const handleFileUpload = useProductStore((state) => state.handleFileUpload);
  const removeImage = useProductStore((state) => state.removeImage);

  const onFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      await handleFileUpload(e.target.files);
      e.target.value = "";
    },
    [handleFileUpload],
  );

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm">Media</Label>
      <Input
        type="file"
        onChange={onFileUpload}
        accept="image/*"
        multiple
        className="border border-dotted border-gray-400"
        disabled={isLoading}
      />
      {isLoading && <p className="text-sm text-gray-500">Uploading...</p>}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-34 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

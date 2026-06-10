"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/stores/product-create-store";

export const VariantsSection = () => {
  const variants = useProductStore((state) => state.formData.variants);
  const images = useProductStore((state) => state.formData.images);
  const option1Name = useProductStore((state) => state.formData.option1Name);
  const option2Name = useProductStore((state) => state.formData.option2Name);
  const option3Name = useProductStore((state) => state.formData.option3Name);
  const addVariant = useProductStore((state) => state.addVariant);
  const removeVariant = useProductStore((state) => state.removeVariant);
  const updateVariant = useProductStore((state) => state.updateVariant);

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Variants</h3>
          <Button
            type="button"
            onClick={addVariant}
            className="text-sm bg-[#06102c] text-white px-3 py-1 rounded hover:bg-[#030d27]"
          >
            + Add Variant
          </Button>
        </div>

        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No variants added. Click "Add Variant" to create one.
          </div>
        ) : (
          variants.map((variant, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 border-b pb-4 last:border-0"
            >
              {variants.length > 1 && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Shopify-style option values */}
              {option1Name && (
                <div>
                  <Label className="text-xs">{option1Name}</Label>
                  <Input
                    type="text"
                    placeholder={`Enter ${option1Name.toLowerCase()}`}
                    value={variant.option1Value || ""}
                    onChange={(e) =>
                      updateVariant(index, "option1Value", e.target.value)
                    }
                  />
                </div>
              )}

              {option2Name && (
                <div>
                  <Label className="text-xs">{option2Name}</Label>
                  <Input
                    type="text"
                    placeholder={`Enter ${option2Name.toLowerCase()}`}
                    value={variant.option2Value || ""}
                    onChange={(e) =>
                      updateVariant(index, "option2Value", e.target.value)
                    }
                  />
                </div>
              )}

              {option3Name && (
                <div>
                  <Label className="text-xs">{option3Name}</Label>
                  <Input
                    type="text"
                    placeholder={`Enter ${option3Name.toLowerCase()}`}
                    value={variant.option3Value || ""}
                    onChange={(e) =>
                      updateVariant(index, "option3Value", e.target.value)
                    }
                  />
                </div>
              )}

              <div>
                <Label className="text-xs">Title (auto-generated)</Label>
                <Input
                  type="text"
                  placeholder="Small / Red / Cotton"
                  disabled
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={variant.price || 0}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs">Compare at Price (Sale)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={variant.compareAtPrice || ""}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "compareAtPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Weight</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={variant.weight || ""}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "weight",
                          e.target.value ? parseFloat(e.target.value) : null,
                        )
                      }
                      className="flex-1"
                    />
                    <select
                      value={variant.weightUnit || "kg"}
                      onChange={(e) =>
                        updateVariant(index, "weightUnit", e.target.value)
                      }
                      className="border rounded px-2 text-sm"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="lb">lb</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Inventory Quantity</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={variant.inventoryQuantity || 0}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "inventoryQuantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">SKU</Label>
                  <Input
                    type="text"
                    placeholder="SKU-001"
                    value={variant.sku || ""}
                    onChange={(e) =>
                      updateVariant(index, "sku", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs">Barcode</Label>
                  <Input
                    type="text"
                    placeholder="123456789012"
                    value={variant.barcode || ""}
                    onChange={(e) =>
                      updateVariant(index, "barcode", e.target.value)
                    }
                  />
                </div>
              </div>

              {images.length > 0 && (
                <div>
                  <Label className="text-xs">Variant Image</Label>
                  <select
                    value={variant.imageIndex ?? ""}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "imageIndex",
                        e.target.value === ""
                          ? undefined
                          : parseInt(e.target.value),
                      )
                    }
                    className="border rounded px-2 py-1 text-sm w-full"
                  >
                    <option value="">No image selected</option>
                    {images.map((img, imgIndex) => (
                      <option key={imgIndex} value={imgIndex}>
                        Image {imgIndex + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

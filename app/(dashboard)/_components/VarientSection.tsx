"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/stores/product-store";

export const VariantsSection = () => {
  const variants = useProductStore((state) => state.formData.variants);
  const images = useProductStore((state) => state.formData.images);
  const options = useProductStore((state) => state.formData.options);
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

              <div>
                <Label className="text-xs">Variant Name</Label>
                <Input
                  type="text"
                  placeholder="Variant name"
                  value={variant.name}
                  onChange={(e) =>
                    updateVariant(index, "name", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(index, "price", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div>
                  <Label className="text-xs">Weight</Label>
                  <div className="flex gap-1">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={variant.weight || ""}
                      onChange={(e) =>
                        updateVariant(index, "weight", e.target.value)
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
              </div>

              <div>
                <Label className="text-xs">Inventory Quantity</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={variant.inventoryQuantity}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "inventoryQuantity",
                      parseInt(e.target.value) || 0,
                    )
                  }
                />
              </div>

              <div>
                <Label className="text-xs">SKU</Label>
                <Input
                  type="text"
                  placeholder="SKU-001"
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, "sku", e.target.value)}
                />
              </div>

              <div>
                <Label className="text-xs">Barcode</Label>
                <Input
                  type="text"
                  placeholder="123456789012"
                  value={variant.barcode}
                  onChange={(e) =>
                    updateVariant(index, "barcode", e.target.value)
                  }
                />
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
                        e.target.value === "" ? undefined : parseInt(e.target.value),
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

              {options.length > 0 && (
                <div>
                  <Label className="text-xs">Option Values</Label>
                  <div className="flex flex-col gap-2">
                    {options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-24">
                          {option.name || `Option ${optIndex + 1}`}:
                        </span>
                        <select
                          value={variant.optionValues?.[optIndex] || ""}
                          onChange={(e) => {
                            const newOptionValues = [...(variant.optionValues || [])];
                            newOptionValues[optIndex] = e.target.value;
                            updateVariant(index, "optionValues", newOptionValues);
                          }}
                          className="border rounded px-2 py-1 text-sm flex-1"
                        >
                          <option value="">Select value</option>
                          {option.values.map((value: string, valIndex: number) => (
                            <option key={valIndex} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

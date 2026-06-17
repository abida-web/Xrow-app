// Updated VariantsSection with per-location inventory
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/stores/product-create-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export const VariantsSection = () => {
  const params = useParams();
  const storeslug = params.storeslug;

  const variants = useProductStore((state) => state.formData.variants);
  const images = useProductStore((state) => state.formData.images);
  const option1Name = useProductStore((state) => state.formData.option1Name);
  const option2Name = useProductStore((state) => state.formData.option2Name);
  const option3Name = useProductStore((state) => state.formData.option3Name);
  const addVariant = useProductStore((state) => state.addVariant);
  const removeVariant = useProductStore((state) => state.removeVariant);
  const updateVariant = useProductStore((state) => state.updateVariant);
  const updateVariantInventoryLevels = useProductStore(
    (state) => state.updateVariantInventoryLevels,
  );
  const fetchStoreLocations = useProductStore(
    (state) => state.fetchStoreLocations,
  );
  const setIsInventoryTracked = useProductStore(
    (state) => state.setIsInventoryTracked,
  );
  const storeLocations = useProductStore((state) => state.storeLocations);
  const isInventoryTracked = useProductStore(
    (state) => state.isInventoryTracked,
  );

  // Fix: Proper useEffect without async in the callback
  useEffect(() => {
    const loadLocations = async () => {
      await fetchStoreLocations();
    };
    loadLocations();
    setIsInventoryTracked(true);
  }, [fetchStoreLocations, setIsInventoryTracked]);

  // Don't show inventory table if tracking is disabled or no locations
  const showInventoryTable = isInventoryTracked && storeLocations.length > 0;

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
              {/* Remove button */}
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

              {/* Option values */}
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

              {/* Title */}
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  type="text"
                  placeholder="Small / Red / Cotton"
                  value={variant.title || ""}
                  onChange={(e) =>
                    updateVariant(index, "title", e.target.value)
                  }
                />
              </div>

              {/* Inventory by Location - Only show if tracking is enabled AND locations exist */}
              {showInventoryTable && (
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Inventory by Location
                  </Label>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="text-gray-800 bg-gray-100">
                          <TableHead>Location</TableHead>
                          <TableHead>Available</TableHead>
                          <TableHead>Incoming</TableHead>
                          <TableHead>Committed</TableHead>
                          <TableHead>On Hand</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {storeLocations.map((location) => {
                          const level = variant.inventoryLevels?.find(
                            (l) => l.locationId === location.id,
                          ) || {
                            available: 0,
                            onHand: 0,
                            incoming: 0,
                            committed: 0,
                          };

                          return (
                            <TableRow key={location.id}>
                              <TableCell className="font-medium">
                                {location.name}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-24"
                                  placeholder="0"
                                  value={level.available}
                                  onChange={(e) =>
                                    updateVariantInventoryLevels(
                                      index,
                                      location.id,
                                      "available",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-24"
                                  placeholder="0"
                                  value={level.incoming}
                                  onChange={(e) =>
                                    updateVariantInventoryLevels(
                                      index,
                                      location.id,
                                      "incoming",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-24"
                                  placeholder="0"
                                  value={level.committed}
                                  onChange={(e) =>
                                    updateVariantInventoryLevels(
                                      index,
                                      location.id,
                                      "committed",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-24"
                                  placeholder="0"
                                  value={level.onHand}
                                  onChange={(e) =>
                                    updateVariantInventoryLevels(
                                      index,
                                      location.id,
                                      "onHand",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Show message when inventory tracking is off */}
              {!isInventoryTracked && (
                <div className="mt-4 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                  Inventory tracking is disabled for this product. Enable it in
                  the product settings.
                </div>
              )}

              {/* Show message when no locations exist */}
              {isInventoryTracked && storeLocations.length === 0 && (
                <div className="mt-4 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                  No store locations found. Please add locations first.
                </div>
              )}

              {/* Price and other fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
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
                  <Label className="text-xs">Compare at Price</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
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
                      min="0"
                      step="0.01"
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
              </div>

              <div className="grid grid-cols-1 gap-3">
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

              {/* Image selection */}
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

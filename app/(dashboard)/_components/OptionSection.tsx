"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/stores/product-create-store";

export const OptionsSection = () => {
  const options = useProductStore((state) => state.formData.options);
  const addOption = useProductStore((state) => state.addOption);
  const removeOption = useProductStore((state) => state.removeOption);
  const updateOption = useProductStore((state) => state.updateOption);

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Options</h3>
          <Button
            type="button"
            onClick={addOption}
            className="text-sm bg-[#06102c] text-white px-3 py-1 rounded hover:bg-[#030d27]"
          >
            + Add Options
          </Button>
        </div>

        {options.map((option, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 border-b pb-4 last:border-0"
          >
            {options.length > 1 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500 text-xs hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}

            <div>
              <Label className="text-xs">Option Name</Label>
              <Input
                type="text"
                placeholder="Size, Color, Material"
                value={option.name}
                onChange={(e) => updateOption(index, "name", e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs">Option Values</Label>
              <Input
                type="text"
                placeholder="XL, Red, Cotton"
                value={option.values.join(", ")}
                onChange={(e) =>
                  updateOption(
                    index,
                    "values",
                    e.target.value.split(", ").filter((v) => v.trim()),
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";

interface ProductFiltersProps {
  vendor: string[];
  setVendor: (value: string[]) => void;
  vendors: string[];
  productType: string[];
  setProductType: (value: string[]) => void;
  productTypes: string[];
  selectedCategory: string[];
  setSelectedCategory: (value: string[]) => void;
  categories: string[];
}

const ProductFilters = ({
  vendor,
  setVendor,
  vendors,
  productType,
  setProductType,
  productTypes,
  selectedCategory,
  setSelectedCategory,
  categories,
}: ProductFiltersProps) => {
  return (
    <div className="mt-4 pt-4 border-t gap-5 flex flex-col md:flex-row items-center">
      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Filter by Vendor
        </label>
        <Combobox
          value={vendor}
          onValueChange={setVendor}
          multiple
          autoHighlight
          items={vendors}
        >
          <ComboboxChips className="w-full">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Select vendors..." />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent>
            <ComboboxEmpty>No vendors found.</ComboboxEmpty>
            <ComboboxList>
              {vendors.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Filter by Product Type
        </label>
        <Combobox
          value={productType}
          onValueChange={setProductType}
          multiple
          autoHighlight
          items={productTypes}
        >
          <ComboboxChips className="w-full">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Select product types..." />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent>
            <ComboboxEmpty>No product types found.</ComboboxEmpty>
            <ComboboxList>
              {productTypes.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-2 block">
          Filter by Category
        </label>
        <Combobox
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          multiple
          autoHighlight
          items={categories}
        >
          <ComboboxChips className="w-full">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput placeholder="Select categories..." />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent>
            <ComboboxEmpty>No categories found.</ComboboxEmpty>
            <ComboboxList>
              {categories.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
};

export default ProductFilters;

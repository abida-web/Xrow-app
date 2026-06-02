import { Product } from "@/types";
import { create } from "zustand";
interface ProductFilter {
  products: Product[];
  setProducts: (products: Product[]) => void;
  selectedStatus: string;
  search: string;
  setSelectedStatus: (selectedStatus: string) => void;
  selectedCategory: string[];
  setSelectedCategory: (selectedCategory: string[]) => void;
  setSearch: (search: string) => void;
  vendor: string[];
  setVendor: (value: string[]) => void;
  productType: string[];
  setProductType: (productType: string[]) => void;
  page: number;
  setPage: (page: number) => void;
}
export const useProductFilter = create<ProductFilter>()((set, get) => ({
  selectedStatus: "all",
  selectedCategory: [],
  products: [],
  search: "",

  setProducts: (products) => set({ products }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearch: (search) => set({ search }),
  vendor: [],
  setVendor: (vendor) => set({ vendor }),
  productType: [],
  setProductType: (productType) => set({ productType }),
  page: 1,
  setPage: (page) => set({ page }),
}));

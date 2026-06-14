// stores/products-filter.ts
import { getAllCatalogs } from "@/actions/getCatlaogs";
import { Product } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface ProductFilter {
  // State
  products: Product[];
  selectedStatus: string;
  search: string;
  selectedCategory: string[];
  vendor: string[];
  productType: string[];
  page: number;
  loading: boolean;
  openFilterDropdown: boolean;
  selectRow: Set<string>;
  visibleColumns: {
    product: boolean;
    status: boolean;
    inventory: boolean;
    category: boolean;
    channels: boolean;
    productType: boolean;
    vendor: boolean;
    created: boolean;
    updated: boolean;
    catalogs: boolean;
  };
  catalogs: any[]; // Replace 'any' with your CatalogProps type

  // Actions
  setProducts: (products: Product[]) => void;
  setSelectedStatus: (selectedStatus: string) => void;
  setSearch: (search: string) => void;
  setSelectedCategory: (selectedCategory: string[]) => void;
  setVendor: (vendor: string[]) => void;
  setProductType: (productType: string[]) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setOpenFilterDropdown: (open: boolean) => void;
  setSelectRow: (
    selectRow: Set<string> | ((prev: Set<string>) => Set<string>),
  ) => void;
  toggleColumnVisible: (columnId: string) => void;
  setCatalogs: (catalogs: any[]) => void;

  // Computed values
  statuses: string[];
  vendors: string[];
  productTypes: string[];
  categories: string[];
  selectAll: boolean;

  // Async actions
  fetchProducts: (storeslug: string) => Promise<void>;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRows: (id: string, checked: boolean | "indeterminate") => void;
  bulkDeleteProducts: (storeslug: string) => Promise<void>;
  handleProductStatusUpdate: (
    status: string,
    storeslug: string,
  ) => Promise<void>;
  handleSalesChannelsStatusUpdate: (
    status: boolean,
    storeslug: string,
  ) => Promise<void>;
  fetchCatalogs: (storeslug: string) => Promise<void>;
  handleAssignProductToCatalog: (
    catalogId: string,
    storeslug: string,
  ) => Promise<void>;
  handleExcludeProductFromCatalog: (
    catalogId: string,
    storeslug: string,
  ) => Promise<void>;
  resetFilters: () => void;
}

export const useProductFilter = create<ProductFilter>()((set, get) => ({
  // Initial state
  products: [],
  selectedStatus: "all",
  search: "",
  selectedCategory: [],
  vendor: [],
  productType: [],
  page: 1,
  loading: true,
  openFilterDropdown: false,
  selectRow: new Set<string>(),
  visibleColumns: {
    product: true,
    status: true,
    inventory: true,
    category: true,
    channels: true,
    productType: true,
    vendor: true,
    created: true,
    updated: true,
    catalogs: true,
  },
  catalogs: [],

  // Basic setters
  setProducts: (products) => set({ products }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, page: 1 }),
  setVendor: (vendor) => set({ vendor, page: 1 }),
  setProductType: (productType) => set({ productType, page: 1 }),
  setPage: (page) => set({ page }),
  setLoading: (loading) => set({ loading }),
  setOpenFilterDropdown: (openFilterDropdown) => set({ openFilterDropdown }),
  setSelectRow: (selectRow) => {
    if (typeof selectRow === "function") {
      set((state) => ({ selectRow: selectRow(state.selectRow) }));
    } else {
      set({ selectRow });
    }
  },
  toggleColumnVisible: (columnId) => {
    set((state) => ({
      visibleColumns: {
        ...state.visibleColumns,
        [columnId]:
          !state.visibleColumns[columnId as keyof typeof state.visibleColumns],
      },
    }));
  },
  setCatalogs: (catalogs) => set({ catalogs }),

  // Computed values
  get statuses() {
    const { products } = get();
    return ["all", ...new Set(products.map((p: any) => p.status))];
  },

  get vendors() {
    const { products } = get();
    return [...new Set(products.map((p: any) => p.vendor).filter(Boolean))];
  },

  get productTypes() {
    const { products } = get();
    return [
      ...new Set(products.map((p: any) => p.productType).filter(Boolean)),
    ];
  },

  get categories() {
    const { products } = get();
    return [
      ...new Set(products.map((p: any) => p.category?.name).filter(Boolean)),
    ];
  },

  get selectAll() {
    const { selectRow, products } = get();
    return selectRow.size === products.length && products.length > 0;
  },

  // Async actions
  fetchProducts: async (storeslug) => {
    const state = get();
    try {
      state.setLoading(true);

      const vendorParam = Array.isArray(state.vendor)
        ? state.vendor.join(",")
        : state.vendor;
      const productTypeParam = Array.isArray(state.productType)
        ? state.productType.join(",")
        : state.productType;
      const categoryParam = Array.isArray(state.selectedCategory)
        ? state.selectedCategory.join(",")
        : state.selectedCategory;

      const queryParams = new URLSearchParams({
        status: state.selectedStatus,
        vendor: vendorParam || "",
        productType: productTypeParam || "",
        category: categoryParam || "",
        search: state.search || "",
        page: state.page.toString(),
      });

      const res = await fetch(
        `/api/dashboard/${storeslug}/products?${queryParams.toString()}`,
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      state.setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      state.setProducts([]);
    } finally {
      state.setLoading(false);
    }
  },

  handleSelectAll: (checked) => {
    const { products } = get();
    if (checked === true) {
      set({ selectRow: new Set(products.map((p: any) => p.id)) });
    } else {
      set({ selectRow: new Set() });
    }
  },

  handleSelectRows: (id, checked) => {
    set((state) => {
      const newSelected = new Set(state.selectRow);
      if (checked === true) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return { selectRow: newSelected };
    });
  },

  bulkDeleteProducts: async (storeslug) => {
    const { selectRow, products, setProducts, setSelectRow } = get();
    const productIds = Array.from(selectRow);

    const { deleteProducts } = await import("@/actions/deleteProduct");
    const deleted = await deleteProducts(storeslug, productIds);

    if (deleted.success) {
      setProducts(products.filter((p) => !selectRow.has(p.id)));
      setSelectRow(new Set());
      toast.success(`Successfully deleted ${productIds.length} product(s)`);
    } else {
      toast.error("Failed to delete products");
    }
  },

  handleProductStatusUpdate: async (status, storeslug) => {
    const { selectRow, products, setProducts, setSelectRow, fetchProducts } =
      get();
    const productIds = Array.from(selectRow);

    const { updatedProductStatus } =
      await import("@/actions/updateProductStatus");
    const update = await updatedProductStatus(storeslug, status, productIds);

    if (update.success) {
      toast.success(
        `Successfully updated ${productIds.length} product(s) to ${status}`,
      );
      setProducts(
        products.map((p: any) =>
          productIds.includes(p.id) ? { ...p, status } : p,
        ),
      );
      setSelectRow(new Set());
    } else {
      toast.error("Failed to update products");
    }
  },

  handleSalesChannelsStatusUpdate: async (status, storeslug) => {
    const { selectRow, fetchProducts, setSelectRow } = get();
    const productIds = Array.from(selectRow);

    const { updateSalesChannelStatus } = await import("@/actions/salesChanel");
    const update = await updateSalesChannelStatus(
      storeslug,
      productIds,
      status,
    );

    if (update.success) {
      toast.success(
        `Successfully ${status ? "published" : "unpublished"} ${update.updatedCount} product(s)`,
      );
      await fetchProducts(storeslug);
      setSelectRow(new Set());
    } else {
      toast.error("Failed to update sales channel status");
    }
  },

  fetchCatalogs: async (storeslug) => {
    const catalogsList = await getAllCatalogs(storeslug);
    set({ catalogs: catalogsList });
  },

  handleAssignProductToCatalog: async (catalogId, storeslug) => {
    const { selectRow, fetchProducts, setSelectRow } = get();
    const productIds = Array.from(selectRow);

    const { addProductToCatalog } =
      await import("@/actions/addProductToCatalog");
    const update = await addProductToCatalog(storeslug, productIds, catalogId);

    if (update.success) {
      toast.success(
        `Successfully included ${productIds.length} product(s) to catalog`,
      );
      await fetchProducts(storeslug);
      setSelectRow(new Set());
    } else {
      toast.error(update.message || "Failed to update products");
    }
  },

  handleExcludeProductFromCatalog: async (catalogId, storeslug) => {
    const { selectRow, fetchProducts, setSelectRow } = get();
    const productIds = Array.from(selectRow);

    const { excludeFromCatalog } = await import("@/actions/deleteFromCatalog");
    const update = await excludeFromCatalog(storeslug, productIds, catalogId);

    if (update.success) {
      toast.success(
        `Successfully excluded ${productIds.length} product(s) from catalog`,
      );
      await fetchProducts(storeslug);
      setSelectRow(new Set());
    } else {
      toast.error(update.message || "Failed to exclude products");
    }
  },

  resetFilters: () => {
    set({
      selectedStatus: "all",
      selectedCategory: [],
      search: "",
      vendor: [],
      productType: [],
      page: 1,
      openFilterDropdown: false,
      selectRow: new Set(),
    });
  },
}));

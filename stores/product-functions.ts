// stores/products-store.ts
import { CatalogProps, Collection, Product } from "@/types";
import { create } from "zustand";
import { toast } from "sonner";
import { deleteProducts } from "@/actions/deleteProduct";
import { updatedProductStatus } from "@/actions/updateProductStatus";
import { updateSalesChannelStatus } from "@/actions/salesChanel";
import { getAllCatalogs } from "@/actions/getCatlaogs";
import { addProductToCatalog } from "@/actions/addProductToCatalog";
import { excludeFromCatalog } from "@/actions/deleteFromCatalog";
import { addProductsToCollection } from "@/actions/addProductsToCollection";
import { removeFromCollection } from "@/actions/deleteFromCollection";

export interface VisibleColumns {
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
}

interface ProductsStore {
  // State
  products: Product[];
  loading: boolean;
  selectRow: Set<string>;
  visibleColumns: VisibleColumns;
  catalogs: CatalogProps[]; // Replace with CatalogProps type
  collections: Collection[];

  // Filter state
  selectedStatus: string;
  search: string;
  selectedCategory: string[];
  vendor: string[];
  productType: string[];
  page: number;
  openFilterDropdown: boolean;

  // Computed values (as getters)
  getStatuses: () => string[];
  getVendors: () => string[];
  getProductTypes: () => string[];
  getCategories: () => string[];
  getSelectAll: () => boolean;

  // Actions - Filter setters (with auto page reset)
  setSelectedStatus: (status: string) => void;
  setSearch: (search: string) => void;
  setSelectedCategory: (categories: string[]) => void;
  setVendor: (vendors: string[]) => void;
  setProductType: (types: string[]) => void;
  setPage: (page: number) => void;
  setOpenFilterDropdown: (open: boolean) => void;
  setCollections: (collections: Collection[]) => void;
  // Actions - Product management
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  fetchProducts: (storeslug: string) => Promise<void>;
  fetchCollections: () => Promise<void>;

  // Actions - Row selection
  setSelectRow: (
    selectRow: Set<string> | ((prev: Set<string>) => Set<string>),
  ) => void;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRows: (id: string, checked: boolean | "indeterminate") => void;
  clearSelection: () => void;

  // Actions - Column visibility
  toggleColumnVisible: (columnId: keyof VisibleColumns) => void;

  // Actions - Bulk operations
  bulkDeleteProducts: (storeslug: string) => Promise<void>;
  handleProductStatusUpdate: (
    status: string,
    storeslug: string,
  ) => Promise<void>;
  handleSalesChannelsStatusUpdate: (
    status: boolean,
    storeslug: string,
  ) => Promise<void>;

  // Actions - Catalog operations
  fetchCatalogs: () => Promise<void>;
  handleAssignProductToCatalog: (
    catalogId: string,
    storeslug: string,
  ) => Promise<void>;
  handleExcludeProductFromCatalog: (
    catalogId: string,
    storeslug: string,
  ) => Promise<void>;
  handleAssignProductToCollection: (
    collectionId: string,
    storeslug: string,
  ) => Promise<void>;
  handleRemoveProductFromCollections: (
    collectionId: string,
    storeslug: string,
  ) => Promise<void>;
  // Actions - Reset
  resetFilters: () => void;
  resetAll: () => void;
}

export const useProductsStore = create<ProductsStore>()((set, get) => ({
  // Initial State
  products: [],
  loading: true,
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
  collections: [],
  selectedStatus: "all",
  search: "",
  selectedCategory: [],
  vendor: [],
  productType: [],
  page: 1,
  openFilterDropdown: false,

  // Computed values
  getStatuses: () => {
    const { products } = get();
    return ["all", ...new Set(products.map((p: any) => p.status))];
  },

  getVendors: () => {
    const { products } = get();
    return [...new Set(products.map((p: any) => p.vendor).filter(Boolean))];
  },

  getProductTypes: () => {
    const { products } = get();
    return [
      ...new Set(products.map((p: any) => p.productType).filter(Boolean)),
    ];
  },

  getCategories: () => {
    const { products } = get();
    return [
      ...new Set(products.map((p: any) => p.category?.name).filter(Boolean)),
    ];
  },

  getSelectAll: () => {
    const { selectRow, products } = get();
    return selectRow.size === products.length && products.length > 0;
  },

  // Filter setters (reset page to 1)
  setSelectedStatus: (selectedStatus) => set({ selectedStatus, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, page: 1 }),
  setVendor: (vendor) => set({ vendor, page: 1 }),
  setProductType: (productType) => set({ productType, page: 1 }),
  setPage: (page) => set({ page }),
  setOpenFilterDropdown: (openFilterDropdown) => set({ openFilterDropdown }),
  setCollections: (collections) => set({ collections }),
  // Product management
  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),

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
  fetchCollections: async () => {
    const state = get();
    try {
      state.setLoading(true);
      const res = await fetch(`/api/dashboard/collections`);
      const data = await res.json();
      state.setCollections(data);
    } catch (error) {
      console.error("Failed to load collections:", error);
      state.setCollections([]);
    } finally {
      state.setLoading(false);
    }
  },

  // Row selection
  setSelectRow: (selectRow) => {
    if (typeof selectRow === "function") {
      set((state) => ({ selectRow: selectRow(state.selectRow) }));
    } else {
      set({ selectRow });
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

  clearSelection: () => set({ selectRow: new Set() }),

  // Column visibility
  toggleColumnVisible: (columnId) => {
    set((state) => ({
      visibleColumns: {
        ...state.visibleColumns,
        [columnId]: !state.visibleColumns[columnId],
      },
    }));
  },

  // Bulk operations
  bulkDeleteProducts: async (storeslug) => {
    const { selectRow, products, setProducts, clearSelection } = get();
    const productIds = Array.from(selectRow);

    const deleted = await deleteProducts(productIds);

    if (deleted.success) {
      setProducts(products.filter((p) => !selectRow.has(p.id)));
      clearSelection();
      toast.success(`Successfully deleted ${productIds.length} product(s)`);
    } else {
      toast.error("Failed to delete products");
    }
  },

  handleProductStatusUpdate: async (status, storeslug) => {
    const { selectRow, products, setProducts, clearSelection, fetchProducts } =
      get();
    const productIds = Array.from(selectRow);

    const update = await updatedProductStatus(status, productIds);

    if (update.success) {
      toast.success(
        `Successfully updated ${productIds.length} product(s) to ${status}`,
      );
      setProducts(
        products.map((p: any) =>
          productIds.includes(p.id) ? { ...p, status } : p,
        ),
      );
      clearSelection();
    } else {
      toast.error("Failed to update products");
    }
  },

  handleSalesChannelsStatusUpdate: async (status, storeslug) => {
    const { selectRow, fetchProducts, clearSelection } = get();
    const productIds = Array.from(selectRow);

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
      clearSelection();
    } else {
      toast.error("Failed to update sales channel status");
    }
  },

  // Catalog operations
  fetchCatalogs: async () => {
    const catalogsList = await getAllCatalogs();
    set({ catalogs: catalogsList });
  },

  handleAssignProductToCatalog: async (catalogId, storeslug) => {
    const { selectRow, fetchProducts, clearSelection } = get();
    const productIds = Array.from(selectRow);

    const update = await addProductToCatalog(productIds, catalogId);

    if (update.success) {
      toast.success(
        `Successfully included ${productIds.length} product(s) to catalog`,
      );
      await fetchProducts(storeslug);
      clearSelection();
    } else {
      toast.error(update.message || "Failed to update products");
    }
  },

  handleExcludeProductFromCatalog: async (catalogId, storeslug) => {
    const { selectRow, fetchProducts, clearSelection } = get();
    const productIds = Array.from(selectRow);

    const update = await excludeFromCatalog(productIds, catalogId);

    if (update.success) {
      toast.success(
        `Successfully excluded ${productIds.length} product(s) from catalog`,
      );
      await fetchProducts(storeslug);
      clearSelection();
    } else {
      toast.error(update.message || "Failed to exclude products");
    }
  },
  handleAssignProductToCollection: async (collectionId, storeslug) => {
    const { selectRow, fetchProducts, clearSelection } = get();
    const productIds = Array.from(selectRow);

    const update = await addProductsToCollection(productIds, collectionId);

    if (update.success) {
      toast.success(
        `Successfully added ${productIds.length} product(s) to collection`,
      );
      await fetchProducts(storeslug);
      clearSelection();
    } else {
      toast.error(update.message || "Failed to update products");
    }
  },
  handleRemoveProductFromCollections: async (catalogId, storeslug) => {
    const { selectRow, fetchProducts, clearSelection } = get();
    const productIds = Array.from(selectRow);

    const update = await removeFromCollection(productIds, catalogId);

    if (update.success) {
      toast.success(
        `Successfully deleted ${productIds.length} product(s) from collection`,
      );
      await fetchProducts(storeslug);
      clearSelection();
    } else {
      toast.error(update.message || "Failed to update products");
    }
  },
  // Reset functions
  resetFilters: () => {
    set({
      selectedStatus: "all",
      selectedCategory: [],
      search: "",
      vendor: [],
      productType: [],
      page: 1,
    });
  },

  resetAll: () => {
    set({
      products: [],
      loading: true,
      selectRow: new Set(),
      selectedStatus: "all",
      search: "",
      selectedCategory: [],
      vendor: [],
      productType: [],
      page: 1,
      openFilterDropdown: false,
      catalogs: [],
    });
  },
}));

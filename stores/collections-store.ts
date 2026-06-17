import { removeCollection } from "@/actions/delete-collection";
import { create } from "zustand";
import { useProductsStore } from "./product-functions";

// Collection Store (for list page)
interface CollectionStore {
  isDeleting: boolean;
  deleteCollections: (
    storeslug: string,
    collectionIds: string[],
  ) => Promise<boolean>;
  updateCollection: (id: string, updatedData: any) => void;
}

// Collection Form Store (for create/edit form)
interface CollectionFormState {
  formData: {
    name: string;
    description: string;
    type: string;
    publishedScope: string;
    image: string;
  };
  imagePreview: string;
  search: string;
  openDialog: boolean;
  selectedProducts: Set<string>;
  uploading: boolean;

  // Actions
  setFormData: (data: Partial<CollectionFormState["formData"]>) => void;
  updateField: <K extends keyof CollectionFormState["formData"]>(
    field: K,
    value: CollectionFormState["formData"][K],
  ) => void;
  setImagePreview: (preview: string) => void;
  setSearch: (search: string) => void;
  setOpenDialog: (open: boolean) => void;
  setSelectedProducts: (
    products: Set<string> | ((prev: Set<string>) => Set<string>),
  ) => void;
  setUploading: (uploading: boolean) => void;
  resetForm: () => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
  isDeleting: false,

  deleteCollections: async (storeslug: string, collectionIds: string[]) => {
    set({ isDeleting: true });

    try {
      const result = await removeCollection(storeslug, collectionIds);

      if (result.success) {
        // Update the products store to remove deleted collections
        const { setCollections, collections } = useProductsStore.getState();
        const updatedCollections = collections.filter(
          (collection) => !collectionIds.includes(collection.id),
        );
        setCollections(updatedCollections);
      }

      set({ isDeleting: false });
      return result.success;
    } catch (error) {
      set({ isDeleting: false });
      return false;
    }
  },

  updateCollection: (id, updatedData) => {
    // Update the collection in the products store
    const { setCollections, collections } = useProductsStore.getState();
    const updatedCollections = collections.map((collection) =>
      collection.id === id ? { ...collection, ...updatedData } : collection,
    );
    setCollections(updatedCollections);
  },
}));

export const useCollectionFormStore = create<CollectionFormState>((set) => ({
  formData: {
    name: "",
    description: "",
    type: "manual",
    publishedScope: "online",
    image: "",
  },
  imagePreview: "",
  search: "",
  openDialog: false,
  selectedProducts: new Set(),
  uploading: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  setImagePreview: (imagePreview) => set({ imagePreview }),
  setSearch: (search) => set({ search }),
  setOpenDialog: (openDialog) => set({ openDialog }),
  setSelectedProducts: (products) =>
    set((state) => ({
      selectedProducts:
        typeof products === "function"
          ? products(state.selectedProducts)
          : products,
    })),
  setUploading: (uploading) => set({ uploading }),

  resetForm: () =>
    set({
      formData: {
        name: "",
        description: "",
        type: "manual",
        publishedScope: "online",
        image: "",
      },
      imagePreview: "",
      search: "",
      openDialog: false,
      selectedProducts: new Set(),
      uploading: false,
    }),
}));

// stores/product-create-store.ts
import { getAllLocations } from "@/actions/getStores";
import { create } from "zustand";

interface ImageType {
  url: string;
}

interface InventoryLevels {
  available: number;
  onHand: number;
  incoming: number;
  committed: number;
  locationId: string;
}

interface VariantType {
  title: string;
  option1Value?: string;
  option2Value?: string;
  option3Value?: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  weight?: number | null;
  weightUnit?: string;
  imageIndex?: number;
  perLocationInventory?: Record<string, number>;
  inventoryLevels: InventoryLevels[];
}
interface ProductFormData {
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  status: string;
  vendor: string;
  productType: string;
  option1Name?: string;
  option2Name?: string;
  option3Name?: string;
  images: ImageType[];
  variants: VariantType[];
  tags: string[];
}

interface ProductStore {
  formData: ProductFormData;
  previewUrls: string[];
  isLoading: boolean;
  uploadProgress: Record<string, number>;
  storeLocations: Array<{
    id: string;
    name: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    storeId: string;
    isActive: boolean | null;
    isDefault: boolean | null;
    address1: string | null;
    phone: string | null;
  }>; // ADD THIS LINE
  isInventoryTracked: boolean;
  // Basic actions
  setFormData: (data: Partial<ProductFormData>) => void;
  updateField: (field: keyof ProductFormData, value: any) => void;
  setStoreLocations: (locations: any[]) => void; // ADD THIS LINE
  setIsInventoryTracked: (isInventoryTracked: boolean) => void;
  // Image actions
  setPreviewUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
  addImages: (images: ImageType[], previews: string[]) => void;
  removeImage: (index: number) => void;
  resetForm: () => void;
  uploadImage: (file: File) => Promise<string | null>;
  handleFileUpload: (files: FileList | null) => Promise<void>;

  // Variant actions
  addVariant: () => void;
  addTag: (tag: string) => void;
  removeVariant: (index: number) => void;
  updateVariant: (index: number, field: keyof VariantType, value: any) => void;
  updateVariantInventoryLevels: (
    variantIndex: number,
    locationId: string,
    field: keyof InventoryLevels,
    value: number,
  ) => void;

  fetchStoreLocations: () => Promise<void>;
}

const initialState: ProductFormData = {
  name: "",
  description: "",
  slug: "",
  categoryId: "",
  status: "draft",
  vendor: "",
  productType: "",
  option1Name: "",
  option2Name: "",
  option3Name: "",
  images: [],
  variants: [], // CHANGE: Start with empty array instead of default variant
  tags: [],
};

export const useProductStore = create<ProductStore>()((set, get) => ({
  formData: initialState,
  previewUrls: [],
  isLoading: false,
  uploadProgress: {},
  storeLocations: [], // ADD THIS LINE
  isInventoryTracked: false,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setIsInventoryTracked: (isInventoryTracked) => set({ isInventoryTracked }),
  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

  setStoreLocations: (locations) => set({ storeLocations: locations }), // ADD THIS LINE
  fetchStoreLocations: async () => {
    const locations = await getAllLocations();
    set({ storeLocations: locations });
  },
  setPreviewUrls: (urls) =>
    set((state) => ({
      previewUrls: typeof urls === "function" ? urls(state.previewUrls) : urls,
    })),

  addImages: (images, previews) =>
    set((state) => ({
      formData: {
        ...state.formData,
        images: [...state.formData.images, ...images],
      },
      previewUrls: [...state.previewUrls, ...previews],
    })),

  removeImage: (index) =>
    set((state) => {
      if (state.previewUrls[index]) {
        URL.revokeObjectURL(state.previewUrls[index]);
      }
      return {
        formData: {
          ...state.formData,
          images: state.formData.images.filter((_, i) => i !== index),
        },
        previewUrls: state.previewUrls.filter((_, i) => i !== index),
      };
    }),

  resetForm: () =>
    set({
      formData: initialState,
      previewUrls: [],
      isLoading: false,
      uploadProgress: {},
      storeLocations: [], // ADD THIS LINE
    }),

  uploadImage: async (file: File) => {
    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=c9668feeda70f40e354b4e3ae6258cf8",
        {
          method: "POST",
          body: formDataImg,
        },
      );
      const data = await response.json();

      if (data.success) {
        return data.data.url;
      }
      return null;
    } catch (error) {
      console.error("Upload failed for file:", file.name, error);
      return null;
    }
  },

  handleFileUpload: async (files) => {
    if (!files || files.length === 0) return;

    const newPreviewUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    set({
      previewUrls: [...get().previewUrls, ...newPreviewUrls],
      isLoading: true,
    });

    const uploadedImages: ImageType[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await get().uploadImage(file);
      if (imageUrl) {
        uploadedImages.push({ url: imageUrl });
      }
    }

    set((state) => ({
      formData: {
        ...state.formData,
        images: [...state.formData.images, ...uploadedImages],
      },
      isLoading: false,
    }));
  },
  addTag: (tag) => {
    set((state) => ({
      formData: {
        ...state.formData,
        tags: [...state.formData.tags, tag.trim()],
      },
    }));
  },
  addVariant: () => {
    const { storeLocations } = get();
    const { isInventoryTracked } = get(); // Get the tracking state

    set((state) => ({
      formData: {
        ...state.formData,
        variants: [
          ...state.formData.variants,
          {
            title: "",
            option1Value: "",
            option2Value: "",
            option3Value: "",
            sku: "",
            barcode: "",
            price: 0,
            compareAtPrice: undefined,
            inventoryQuantity: 0,
            weight: null,
            weightUnit: "kg",
            imageIndex: undefined,
            inventoryLevels:
              isInventoryTracked && storeLocations.length > 0
                ? storeLocations.map((location) => ({
                    locationId: location.id,
                    available: 0,
                    onHand: 0,
                    incoming: 0,
                    committed: 0,
                  }))
                : [],
          },
        ],
      },
    }));
  },
  removeVariant: (index: number) =>
    set((state) => ({
      formData: {
        ...state.formData,
        variants: state.formData.variants.filter((_, i) => i !== index),
      },
    })),

  updateVariant: (index, field, value) =>
    set((state) => {
      const updatedVariants = [...state.formData.variants];
      updatedVariants[index] = { ...updatedVariants[index], [field]: value };
      return {
        formData: {
          ...state.formData,
          variants: updatedVariants,
        },
      };
    }),
  // Simplified updateVariantInventoryLevels
  updateVariantInventoryLevels: (variantIndex, locationId, field, value) =>
    set((state) => {
      const updatedVariants = [...state.formData.variants];
      const variant = updatedVariants[variantIndex];

      if (!variant.inventoryLevels) {
        variant.inventoryLevels = [];
      }

      let level = variant.inventoryLevels.find(
        (l) => l.locationId === locationId,
      );

      if (!level) {
        level = {
          locationId,
          available: 0,
          onHand: 0,
          incoming: 0,
          committed: 0,
        };
        variant.inventoryLevels.push(level);
      }
      (level[field as keyof typeof level] as number) = value;

      // Recalculate total inventory
      variant.inventoryQuantity = variant.inventoryLevels.reduce(
        (sum, l) => sum + (l.available || 0),
        0,
      );

      return {
        formData: {
          ...state.formData,
          variants: updatedVariants,
        },
      };
    }),
}));

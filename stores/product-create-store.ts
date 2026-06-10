// stores/product-create-store.ts
import { create } from "zustand";

interface ImageType {
  url: string;
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

  // Basic actions
  setFormData: (data: Partial<ProductFormData>) => void;
  updateField: (field: keyof ProductFormData, value: any) => void;

  // Image actions
  setPreviewUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
  addImages: (images: ImageType[], previews: string[]) => void;
  removeImage: (index: number) => void;
  resetForm: () => void;
  uploadImage: (file: File) => Promise<string | null>;
  handleFileUpload: (files: FileList | null) => Promise<void>;

  // Variant actions
  addVariant: () => void;
  removeVariant: (index: number) => void;
  updateVariant: (index: number, field: keyof VariantType, value: any) => void;
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
  variants: [
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
    },
  ],
  tags: [],
};

export const useProductStore = create<ProductStore>()((set, get) => ({
  formData: initialState,
  previewUrls: [],
  isLoading: false,
  uploadProgress: {},

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),

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

  addVariant: () =>
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
          },
        ],
      },
    })),

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
}));
import { Product } from "@/types";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

interface ImageType {
  url: string;
}

interface ProductFormData {
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  status: string;
  vendor: string;
  productType: string;
  images: ImageType[];
  options: any[];
  variants: any[];
  tags: string[];
}

interface ProductsPageProps {
  params: Promise<{
    storeslug: string;
  }>;
}

interface ProductStore {
  formData: ProductFormData;
  previewUrls: string[];
  isLoading: boolean;
  uploadProgress: Record<string, number>;

  // Basic actions
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setSlug: (slug: string) => void;
  setCategoryId: (categoryId: string) => void;
  setFormData: (data: Partial<ProductFormData>) => void;

  // Optimized field update
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
  updateVariant: (index: number, field: string, value: any) => void;

  // Option actions
  addOption: () => void;
  removeOption: (index: number) => void;
  updateOption: (index: number, field: string, value: any) => void;
}

const initialState: ProductFormData = {
  name: "",
  description: "",
  slug: "",
  categoryId: "",
  status: "draft",
  vendor: "",
  productType: "",
  images: [],
  options: [],
  variants: [
    {
      name: "Default Variant",
      sku: "",
      barcode: "",
      price: 0,
      inventoryQuantity: 0,
      weight: null,
      weightUnit: "kg",
      imageId: null,
      imageIndex: undefined,
      optionValues: [],
    },
  ],
  tags: [],
};

export const useProductStore = create<ProductStore>()((set, get) => ({
  formData: initialState,
  previewUrls: [],
  isLoading: false,
  uploadProgress: {},

  setName: (name) =>
    set((state) => ({
      formData: { ...state.formData, name },
    })),

  setDescription: (description) =>
    set((state) => ({
      formData: { ...state.formData, description },
    })),

  setSlug: (slug) =>
    set((state) => ({
      formData: { ...state.formData, slug },
    })),

  setCategoryId: (categoryId) =>
    set((state) => ({
      formData: { ...state.formData, categoryId },
    })),

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  // Optimized field update - more efficient than setFormData for single fields
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

    // Show previews immediately for better UX
    const newPreviewUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    set({
      previewUrls: [...get().previewUrls, ...newPreviewUrls],
      isLoading: true,
    });

    // Upload in background
    const uploadedImages: ImageType[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await get().uploadImage(file);
      if (imageUrl) {
        uploadedImages.push({ url: imageUrl });
      }
    }

    // Update with actual URLs
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
            name: `Variant ${state.formData.variants.length + 1}`,
            sku: "",
            barcode: "",
            price: 0,
            inventoryQuantity: 0,
            weight: null,
            weightUnit: "kg",
            imageId: null,
            imageIndex: undefined,
            optionValues: [],
          },
        ],
      },
    })),

  addOption: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        options: [...state.formData.options, { name: "", values: [""] }],
      },
    })),

  removeOption: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        options: state.formData.options.filter((_, i) => i !== index),
      },
    })),

  updateOption: (index: number, field: string, value: any) =>
    set((state) => {
      const updatedOptions = [...state.formData.options];
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      return {
        formData: {
          ...state.formData,
          options: updatedOptions,
        },
      };
    }),

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

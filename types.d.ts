// types/index.ts or types.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string; // Allow undefined, not null
  onboardingCompleted: boolean;
}
export interface FormDataProps {
  name: string;
  slug: string;
  shopDomain: string;
  logoUrl: string;
  businessType: string;
  currency: string;
}

export interface BusinessType {
  value: string;
  label: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ImgBBResponse {
  data: {
    url: string;
    [key: string]: unknown;
  };
  success?: boolean;
  status?: number;
}

export interface SessionData {
  data?: {
    user?: User;
    session?: unknown;
  };
}

export interface Product {
  id: string;
  name: string;
  status: string;
  images?: Array<{ url: string }>;
  variants?: Array<{ inventoryQuantity: string; price?: number }>;
  category?: { name: string };
  productType?: string;
  vendor?: string;
  createAt?: string;
  updatedAt?: string;
  catalogs?: Array<{ id: string; name: string; handle: string; type: string }>; // ✅ Add this
}

export type CatalogProps = {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  handle: string;
  isActive: boolean | null;
  type: string | null;
  catalogProducts?: any[]; // ✅ Fix: make optional and use any[] or proper type
  createdAt: Date | null;
  updatedAt: Date | null;
};
export interface Collection {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  type: string | null; // "manual" or other types
  publishedScope: string | null;
  image: string | null;
  slug: string;
  createdAt: Date | null;
  collectionProducts: any[];
}

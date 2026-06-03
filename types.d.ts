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
interface Product {
  id: string;
  name: string;
  status: string;
  images?: Array<{ url: string }>;
  variants?: Array<{ inventoryQuantity?: number; price?: number }>;
  category?: { name: string };
  productType?: string;
  vendor?: string;
  createAt?: string;
  updatedAt?: string;
}

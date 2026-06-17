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

export interface InventoryLevels {
  locationId: string;
  available: number;
  onHand: number;
  incoming: number;
  committed: number;
}

export interface ProductVariant {
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
  inventoryLevels: InventoryLevels[];
}

export interface ProductImage {
  url: string;
}

export interface ProductFormData {
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
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
}

export interface ExtendedCustomerForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  country: string;
  note: string;
  postalCode: string;
  acceptsMarketing: boolean;
  countryCode: string;
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
  createdAt: Date;
  collectionProducts: any[];
}
// types/index.ts

export interface Address {
  id: string;
  customerId: string | null;
  country: string;
  city: string;
  addressLineOne: string;
  addressLineTwo: string;
  postalCode: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  totalPrice: string;
  currency: string;
  status: string;
  giftCardId: string | null;
  giftCardApplied: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftCard {
  id: string;
  code: string;
  codeHash: string;
  initialValue: string;
  balance: string | null;
  currency: string;
  storeId: string | null;
  enabled: boolean;
  customerId: string | null;
  orderId: string | null;
  createdAt: Date;
  expiresOn: Date | null;
  note: string | null;
  recipientEmail: string | null;
  recipientMessage: string | null;
}

export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  note: string | null;
  storeId: string | null;
  subscribe: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  // Nested relations (all optional)
  orders?: Order[];
  addresses?: Address[];
  giftCards?: GiftCard[];
  totalSpent?: number;
  orderCount?: number;
}
export interface GiftCard {
  id: string;
  code: string;
  initialValue: string;
  balance: string | null;
  currency: string;
  note: string | null;
  expiresOn: Date | null;
  createdAt: Date;
  email?: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

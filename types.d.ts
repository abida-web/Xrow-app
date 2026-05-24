export interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  [key: string]: unknown;
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

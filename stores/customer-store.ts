// stores/customer-store.ts
"use client";
import { create } from "zustand";

interface BasicCustomerForm {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  note?: string;
}

interface ExtendedCustomerForm extends BasicCustomerForm {
  address1: string;
  address2: string;
  city: string;
  zip: string;
  postalCode: string;
  country: string;
  acceptsMarketing: boolean;
  note: string;
}

interface CustomerStoreProp {
  customerForm: BasicCustomerForm;
  setCustomerForm: (data: Partial<BasicCustomerForm>) => void;
  resetCustomerForm: () => void;
  searchCustomer: string;
  setSearchCustomer: (searchCustomer: string) => void;
  extendedCustomerForm: ExtendedCustomerForm;
  setExtendedCustomerForm: (data: Partial<ExtendedCustomerForm>) => void;
  resetExtendedCustomerForm: () => void;
  populateExtendedForm: (customer: any) => void;
  resetExtendedFormToInitial: () => void;
  getExtendedFormData: () => ExtendedCustomerForm;
}

const initialExtendedForm: ExtendedCustomerForm = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  zip: "",
  postalCode: "",
  country: "",
  acceptsMarketing: false,
  note: "",
};

export const useCustomerStore = create<CustomerStoreProp>((set, get) => ({
  customerForm: {
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  },
  searchCustomer: "",
  setCustomerForm: (data) =>
    set((state) => ({
      customerForm: { ...state.customerForm, ...data },
    })),
  resetCustomerForm: () =>
    set({
      customerForm: {
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
      },
    }),
  setSearchCustomer: (searchCustomer) => set({ searchCustomer }),
  extendedCustomerForm: initialExtendedForm,
  setExtendedCustomerForm: (data) =>
    set((state) => ({
      extendedCustomerForm: { ...state.extendedCustomerForm, ...data },
    })),
  resetExtendedCustomerForm: () =>
    set({ extendedCustomerForm: initialExtendedForm }),

  populateExtendedForm: (customer) => {
    if (!customer) return;
    const address = customer.addresses?.[0] || {};
    set({
      extendedCustomerForm: {
        email: customer.email || "",
        phone: customer.phone || "",
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        address1: address.addressLineOne || "",
        address2: address.addressLineTwo || "",
        city: address.city || "",
        zip: address.zip || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        acceptsMarketing: address.acceptsMarketing || false,
        note: customer.note || "",
      },
    });
  },

  resetExtendedFormToInitial: () => {
    set({ extendedCustomerForm: initialExtendedForm });
  },

  getExtendedFormData: () => {
    return get().extendedCustomerForm;
  },
}));

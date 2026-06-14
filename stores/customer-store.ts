import { create } from "zustand";

interface CustomerStoreProp {
  customerForm: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  setCustomerForm: (data: Partial<CustomerStoreProp["customerForm"]>) => void;
  resetCustomerForm: () => void;
}

export const useCustomerStore = create<CustomerStoreProp>((set) => ({
  customerForm: {
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  },
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
}));

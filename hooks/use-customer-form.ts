// hooks/use-customer-form.ts
"use client";

import { useCallback } from "react";
import { useCustomerStore } from "@/stores/customer-store";
import { ExtendedCustomerForm } from "@/types";

export function useCustomerForm() {
  const extendedCustomerForm = useCustomerStore(
    (state) => state.extendedCustomerForm,
  );
  const setExtendedCustomerForm = useCustomerStore(
    (state) => state.setExtendedCustomerForm,
  );
  const populateExtendedForm = useCustomerStore(
    (state) => state.populateExtendedForm,
  );
  const resetExtendedFormToInitial = useCustomerStore(
    (state) => state.resetExtendedFormToInitial,
  );
  const getExtendedFormData = useCustomerStore(
    (state) => state.getExtendedFormData,
  );
  const setField = useCallback(
    <K extends keyof ExtendedCustomerForm>(
      field: K,
      value: ExtendedCustomerForm[K],
    ) => {
      setExtendedCustomerForm({
        [field]: value,
      } as Partial<ExtendedCustomerForm>);
    },
    [setExtendedCustomerForm],
  );

  const resetForm = useCallback(() => {
    resetExtendedFormToInitial();
  }, [resetExtendedFormToInitial]);

  const populateForm = useCallback(
    (customer: any) => {
      populateExtendedForm(customer);
    },
    [populateExtendedForm],
  );

  const getFormData = useCallback(() => {
    return getExtendedFormData();
  }, [getExtendedFormData]);

  return {
    extendedCustomerForm,
    setField,
    setExtendedCustomerForm,
    resetForm,
    populateForm,
    getFormData,
  };
}

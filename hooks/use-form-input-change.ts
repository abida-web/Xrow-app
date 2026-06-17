import { useCallback, type ChangeEvent } from "react";

export type FormInputChangeHandler<T> = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

export function useFormInputChange<T extends object>(
  updateField: (field: keyof T, value: unknown) => void,
): FormInputChangeHandler<T> {
  return useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      updateField(name as keyof T, value);
    },
    [updateField],
  );
}

import { useCallback } from "react";
import { createObjectWithKeys, formDom } from "./utils";
import { FormEventDetail, ReactiveFormState } from "./types";

export const useFormReset = <T extends string, TData extends object>({
  formName,
  defaultValue,
}: {
  formName: T;
  defaultValue: TData;
}) => {
  const reset = useCallback(() => {
    const newState: ReactiveFormState<T, TData> = {
      formName,
      dirty: {
        name: formName,
        values: createObjectWithKeys(defaultValue, () => false) as any,
      },
      touched: {
        name: formName,
        values: createObjectWithKeys(defaultValue, () => false) as any,
      },
      values: {
        name: formName,
        values: defaultValue,
      },
      errors: {
        name: formName,
        values: createObjectWithKeys(defaultValue, () => undefined) as any,
      },
      isSubmitted: false,
      isDirty: false,
      isTouched: false,
    };

    formDom.write(formName, newState);

    const evt = new CustomEvent<FormEventDetail<TData>>(`form-state`, {
      detail: {
        formName,
        state: newState,
        isSubmitted: false,
      },
    });

    window.dispatchEvent(evt);

    const formEl = document.querySelector(`form[data-form-name="${formName}"]`);
    if (!formEl) return;

    const inputs = formEl.querySelectorAll(`input, textarea, select`);
    inputs.forEach((input) => {
        if (input instanceof HTMLInputElement) {
            input.value = defaultValue[input.name as keyof TData] as string;
        } else if (input instanceof HTMLSelectElement) {
            input.value = defaultValue[input.name as keyof TData] as string;
        } else if (input instanceof HTMLTextAreaElement) {
            input.value = defaultValue[input.name as keyof TData] as string;
        }
    });

  }, [formName, defaultValue]);

  return reset;
};

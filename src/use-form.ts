import { useCallback, useEffect, useRef } from "react";
import { createForm } from "./create-form";
import { ReactiveForm } from "./types";
import { formDom } from "./utils";

export const useForm = <T extends string, TData extends object>({
  formName,
  defaultValue,
  onSubmit,
  validators,
}: {
  formName: T;
  defaultValue: TData;
  onSubmit: (values: TData) => void;
  validators?: Record<keyof TData, (value: any) => string | undefined>;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const reactiveForm = useRef<ReactiveForm<TData> | undefined>(undefined);

  const handleSubmit = useCallback(
    (e: SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!reactiveForm.current) return;
      const state = formDom.read<T, TData>(formName)!;
      const values = state.values;

      if (validators) {
        let hasErrors = false;
        Object.keys(validators).forEach((key) => {
          const value = values.values[key as keyof TData];
          const error = validators[key as keyof TData](value);
          if (error) {
            hasErrors = true;
            reactiveForm.current!.setErrors({ [key]: error } as Record<
              keyof TData,
              string
            >);
          }
        });
        if (hasErrors) return;
      }

      reactiveForm.current.submit();

      onSubmit(values.values);
    },
    [reactiveForm, validators, onSubmit]
  );

  const handleInputChange = useCallback(
    (e: Event) => {
      if (!reactiveForm.current) return;
      const target = e.target as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
      const { name, value } = target || {};
      if (!name) return;

      if (validators) {
        const validator = validators[name as keyof TData];
        if (validator) {
          const error = validator(value);
          const validatorEl = formRef.current?.querySelector(
            `[data-validator-for="${name}"]`
          );

          if (error) {
            reactiveForm.current.setErrors({ [name]: error } as Record<
              keyof TData,
              string
            >);

            if (validatorEl) {
              validatorEl.innerHTML = error;
            }
          } else {
            const formErrors = formDom.read<T, TData>(formName).errors.values;
            const currentError = formErrors[name as keyof TData];
            if (currentError) {
              reactiveForm.current.setErrors({ [name]: "" } as Record<
                keyof TData,
                string
              >);
            }
            if (validatorEl) {
              validatorEl.innerHTML = "";
            }
          }
        }
      }

      reactiveForm.current.setValues({ [name]: value } as Partial<TData>);

      const current = formDom.read<T, TData>(formName);
      if (current.dirty.values[name as keyof TData]) return;

      reactiveForm.current.setDirty({ [name]: true } as Record<
        keyof TData,
        boolean
      >);
    },
    [reactiveForm]
  );

  const handleFocusChange = useCallback(
    (e: Event) => {
      if (!reactiveForm.current) return;
      const target = e.target as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
      const { name } = target || {};

      if ("select" in target) {
        target.select();
      }

      if (!name) return;

      const current = formDom.read<T, TData>(formName);
      if (current.touched.values[name as keyof TData]) return;

      reactiveForm.current.setTouched({ [name]: true } as Record<
        keyof TData,
        boolean
      >);
    },
    [reactiveForm]
  );

  useEffect(() => {
    if (!formRef.current) return;

    reactiveForm.current = createForm(formName, defaultValue);

    formRef.current.addEventListener("submit", handleSubmit);

    formRef.current.setAttribute("data-form-name", formName);
    formRef.current.setAttribute("name", formName);

    const inputs = formRef.current.querySelectorAll("input");

    inputs.forEach((input) => {
      input.removeEventListener("change", handleInputChange);
      input.addEventListener("change", handleInputChange);
      input.removeEventListener("focus", handleFocusChange);
      input.addEventListener("focus", handleFocusChange);
      input.value = String(
        reactiveForm.current!.defaultValue[input.name as keyof TData]
      );
    });

    const selects = formRef.current.querySelectorAll("select");

    selects.forEach((select) => {
      select.removeEventListener("change", handleInputChange);
      select.addEventListener("change", handleInputChange);
      select.removeEventListener("focus", handleFocusChange);
      select.addEventListener("focus", handleFocusChange);
      select.value = String(
        reactiveForm.current!.defaultValue[select.name as keyof TData]
      );
    });

    const textareas = formRef.current.querySelectorAll("textarea");

    textareas.forEach((textarea) => {
      textarea.removeEventListener("change", handleInputChange);
      textarea.addEventListener("change", handleInputChange);
      textarea.removeEventListener("focus", handleFocusChange);
      textarea.addEventListener("focus", handleFocusChange);
      textarea.value = String(
        reactiveForm.current!.defaultValue[textarea.name as keyof TData]
      );
    });

    return () => {
      if (formRef.current) {
        formRef.current.removeEventListener("submit", handleSubmit);
        console.log("removed event listener");
        const inputs = formRef.current.querySelectorAll("input");
        inputs.forEach((input) => {
          input.removeEventListener("change", handleInputChange);
          input.removeEventListener("focus", handleFocusChange);
        });
        const selects = formRef.current.querySelectorAll("select");
        selects.forEach((select) => {
          select.removeEventListener("change", handleInputChange);
          select.removeEventListener("focus", handleFocusChange);
        });
        const textareas = formRef.current.querySelectorAll("textarea");
        textareas.forEach((textarea) => {
          textarea.removeEventListener("change", handleInputChange);
          textarea.removeEventListener("focus", handleFocusChange);
        });
      }
    };
  }, [formRef]);

  return formRef;
};

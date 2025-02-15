import { FieldValue, FormEventDetail, ReactiveFormState } from "../types";

export const formDom = {
  $: (formName: string) => {
    return document.querySelector(`[data-form-values="${formName}"]`);
  },
  write: <T extends string, TData extends object>(
    formName: T,
    form: ReactiveFormState<T, TData>
  ) => {
    let current = formDom.$(formName);
    if (!current) {
      current = document.createElement("script");
      current.setAttribute("data-form-values", formName);
      current.setAttribute("type", "application/json");
      current.textContent = JSON.stringify(form);
      document.body.appendChild(current);
    }
    current.textContent = JSON.stringify(form);
  },
  read: <T extends string, TData extends object>(formName: T) => {
    const current = formDom.$(formName);
    if (!current) {
      throw new Error(`Form with name ${formName} does not exist`);
    }
    return JSON.parse(current.innerHTML!) as ReactiveFormState<T, TData>;
  },
  remove: (formName: string) => {
    const current = formDom.$(formName);
    if (current) {
      document.body.removeChild(current);
    }
  },
};

export const createObjectWithKeys = <T extends object>(
  obj: T,
  cb: (key: string) => FieldValue
): { [K in keyof T]: FieldValue } => {
  const newObj: { [K in keyof T]: FieldValue } = {} as {
    [K in keyof T]: FieldValue;
  };

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = cb(key);
    }
  }

  return newObj;
};

export function isFieldValue(value: unknown): value is FieldValue {
    return (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value instanceof Date ||
        value === undefined
    );
}

export function isCustomEventDetail<T extends object>(value: unknown): value is FormEventDetail<T> {
    return (
        typeof value === "object" &&
        value !== null &&
        "formName" in value &&
        "state" in value
    )
}

export function isCustomFormEvent<T extends object>(event: Event, formName: string): event is CustomEvent {
    return (
        event instanceof CustomEvent &&
        isCustomEventDetail<T>(event.detail) &&
        event.detail.formName === formName
    )
}

export type FieldValue = string | number | boolean | Date | undefined;

export type DirtyFields<T extends string, TData extends object> = {
  name: T;
  values: Record<keyof TData, boolean>;
};

export type TouchedFields<T extends string, TData extends object> = {
  name: T;
  values: Record<keyof TData, boolean>;
};

export type FieldErrors<T extends string, TData extends object> = {
  name: T;
  values: Record<keyof TData, string | undefined>;
};

export type FieldValues<T extends string, TData extends object> = {
  name: T;
  values: Record<keyof TData, any>;
};

export type ReactiveFormState<T extends string, TData extends object> = {
  formName: T;
  dirty: DirtyFields<T, TData>;
  touched: TouchedFields<T, TData>;
  values: FieldValues<T, TData>;
  errors: FieldErrors<T, TData>;
  isSubmitted: boolean;
  isDirty: boolean;
  isTouched: boolean;
};

export type ReactiveForm<T extends object> = {
  formName: string;
  defaultValue: T;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: Record<keyof T, string>) => void;
  reset: (notify?: boolean) => void;
  setDirty: (dirty: Record<keyof T, boolean>) => void;
  setTouched: (touched: Record<keyof T, boolean>) => void;
  submit: () => T;  
};

export type FormEventDetail<T extends object> = {
    formName: string;
    state: ReactiveFormState<string, T>;
    isSubmitted?: boolean;
}
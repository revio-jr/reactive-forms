import type {
  ReactiveFormState,
  ReactiveForm,
  DirtyFields,
  FieldErrors,
  TouchedFields,
  FormEventDetail,
} from "./types";
import { createObjectWithKeys, formDom } from "./utils";

export const createForm = <T extends string, TData extends object>(
  formName: T,
  initialValues: TData
): ReactiveForm<TData> => {
  const createInitialState = (): ReactiveFormState<T, TData> => ({
    formName,
    dirty: {
      name: formName,
      values: createObjectWithKeys(initialValues, () => false) as DirtyFields<
        T,
        TData
      >["values"],
    },
    touched: {
      name: formName,
      values: createObjectWithKeys(initialValues, () => false) as TouchedFields<
        T,
        TData
      >["values"],
    },
    values: {
      name: formName,
      values: createObjectWithKeys(
        initialValues,
        (key) => (initialValues as any)[key]
      ) as DirtyFields<T, TData>["values"],
    },
    errors: {
      name: formName,
      values: createObjectWithKeys(
        initialValues,
        () => undefined
      ) as FieldErrors<T, TData>["values"],
    },
    isSubmitted: false,
    isDirty: false,
    isTouched: false,
  });

  formDom.write(formName, createInitialState());

  const notifyListeners = (isSubmitted = false) => {
    const state = formDom.read<T, TData>(formName)!;
    const evt = new CustomEvent<FormEventDetail<TData>>(`form-state`, {
      detail: {
        formName,
        state,
        isSubmitted,
      },
    });
    window.dispatchEvent(evt);
  };

  return {
    defaultValue: initialValues,
    formName,
    setValues: (values) => {
      const curr = formDom.read<T, TData>(formName)!;

      formDom.write(formName, {
        ...curr,
        values: {
          ...curr.values,
          values: {
            ...curr.values.values,
            ...values,
          },
        },
      });

      notifyListeners();
    },
    setErrors: (errors) => {
      const curr = formDom.read<T, TData>(formName)!;
      formDom.write(formName, {
        ...curr,
        errors: {
          name: formName,
          values: {
            ...curr.errors.values,
            ...errors,
          },
        },
      });
      notifyListeners();
    },
    setDirty: (dirty) => {
      const curr = formDom.read<T, TData>(formName)!;
      formDom.write(formName, {
        ...curr,
        dirty: {
          name: formName,
          values: {
            ...curr.dirty,
            ...dirty,
          },
        },
        isDirty: true,
      });
      notifyListeners();
    },
    setTouched: (touched) => {
      const curr = formDom.read<T, TData>(formName)!;
      formDom.write(formName, {
        ...curr,
        touched: {
          name: formName,
          values: {
            ...curr.touched.values,
            ...touched,
          },
        },
        isTouched: true,
      });
      notifyListeners();
    },
    reset: () => {
      formDom.write(formName, createInitialState());
      notifyListeners();
    },
    submit: () => {
      const formState = formDom.read<T, TData>(formName)!;
      formDom.write(formName, {
        ...formState,
        isSubmitted: true,
      });
      notifyListeners(true);

      return formState.values.values;
    },
  };
};

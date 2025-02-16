import { useCallback, useEffect, useRef } from "react";
import { useFormState } from "./use-form-state";

export const useFormTemplate = <
  T extends string,
  TData extends object,
  TTemplate extends HTMLElement = HTMLDivElement
>({
  formName,
  defaultValue,
  transform,
}: {
  formName: T;
  defaultValue: TData;
  transform?: (key: keyof TData, value: any, submitted: boolean) => string | undefined;
}) => {
  const ref = useRef<TTemplate>(null);

  const formState = useFormState<T, TData>({
    formName,
    defaultValue,
  });

  const setNodeValue = useCallback(
    (node: HTMLElement, key: keyof TData, value: any) => {
        console.log('setNodeValue', node, key, value);
        if (!String(value)) {
            node.setAttribute('data-empty', 'true');
        } else {
            node.removeAttribute('data-empty');
        }
        if (formState?.errors?.values?.[key]) {
            node.setAttribute('data-invalid', 'true');
        } else {
            node.removeAttribute('data-invalid');
        }
      if (!transform) {
        node.innerHTML = String(value);
        return;
      }
      const transformedValue = transform(key, value, Boolean(formState?.isSubmitted)) ?? String(value);
      node.innerHTML = transformedValue;
    },
    [transform, formState]
  );

  useEffect(() => {
    if (!ref.current || !formState) return;
    const boundNodes = ref.current.querySelectorAll(`[data-bind]`);
    boundNodes.forEach((node) => {
      const key = node.getAttribute(`data-bind`);
      if (!key) return;
      setNodeValue(
        node as HTMLElement,
        key as keyof TData,
        formState?.values.values[key as keyof TData] as any
      );
    });
    ref.current.setAttribute('data-state', formState.isSubmitted ? 'submitted' : 'pending');
  }, [formState, setNodeValue]);

  return ref;
};

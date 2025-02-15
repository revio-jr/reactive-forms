import { useCallback, useEffect, useState } from "react";
import { createObjectWithKeys, formDom, isCustomFormEvent } from "./utils";
import { ReactiveFormState } from "./types";

export const useFormState = <T extends string, TData extends object>({
    formName,
    defaultValue,
}: {
    formName: T,
    defaultValue: TData,
}) => {
    const [state, setState] = useState<ReactiveFormState<T, TData> | undefined>(() => {
        return {
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
            isValid: false,
            isSubmitted: false,
            isDirty: false,
            isTouched: false,        
        } as ReactiveFormState<T, TData>;
    });

    const handleState = useCallback((e: Event) => {
        if (!isCustomFormEvent(e, formName)) return;
        if (e.detail.formName !== formName) return;
        const values = formDom.read<T, TData>(formName)!;
        setState(values);
    }, [formName]);

    useEffect(() => {

        window.addEventListener(`form-state`, handleState);

        return () => {
            window.removeEventListener(`form-state`, handleState);
        }

    }, []);

    return state;
}
import { useCallback, useEffect, useState } from "react";
import { formDom, isCustomFormEvent } from "./utils";

export const useFormValues = <T extends string, TData extends object>({
    formName,
    defaultValue
}: {
    formName: T,
    defaultValue: TData,
}) => {
    const [state, setState] = useState<TData>({...defaultValue});

    const handleState = useCallback((e: Event) => {
        if (!isCustomFormEvent(e, formName)) return;
        if (e.detail.formName !== formName) return;
        const values = formDom.read<T, TData>(formName)!.values;
        setState(values.values);
    }, [formName]);

    useEffect(() => {

        window.addEventListener(`form-state`, handleState);

        return () => {
            window.removeEventListener(`form-state`, handleState);
        }

    }, []);

    return state;
}
// import React, { useCallback, useEffect, useRef } from "react"
// import { FieldValue, ReactiveForm, ReactiveFormState } from "./types";
// import { isCustomEventDetail, isCustomFormEvent } from "./utils";

// export function Form({}: {}) {
//     return (
//         <div></div>
//     )
// }

// export function FormLabel<T extends object>({
//     htmlFor,
//     label
// }: {
//     htmlFor: keyof T;
//     label: string;
// }) {
//     return (
//         <label htmlFor={String(htmlFor)}>{label}</label>
//     )
// }

// export function FormDiv<T extends string, TData extends object>({
//     formName,
//     children,
// }: {
//     formName: T;
//     children: string;
// }) {

//     const ref = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         if (!ref.current) return;

//         const handleState = useCallback((e: Event) => {

//             if (!isCustomFormEvent<TData>(e, formName)) return;
//             if (e.detail.formName !== formName) return;

//             const newState = isCustomEventDetail<TData>(e.detail) ? e.detail.state : undefined;
//             if (!newState) return;
// )
//         }, [formName, children]);

//         window.addEventListener(`form-state`, handleState);

//         return () => {
//             window.removeEventListener(`${formName}-state`, handleState);
//         }

//     }, [ref]);

//     return (
//         <div ref={ref}>

//         </div>
//     )
// }

// // export function FormControl<T extends string, TData extends object>({
// //     name,
// //     register,
// //     children,
// // }: {
// //     name: T;
// //     register: ReactiveForm<TData>["register"];
// //     children: ({
// //         onChange,
// //         onBlur,
// //     }: { onChange: React.ChangeEventHandler<HTMLInputElement>, onBlur: React.FocusEventHandler<HTMLInputElement>, defaultValues: ReactiveFormState<T, TData> }) => React.ReactNode;
// // }) {

// //     const [state, setState] = React.useState<ReactiveFormState<T, TData>>({} as ReactiveFormState<T, TData>);

// //     const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        
// //     }, []);

// //     const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
// //     }, []);

// //     useEffect(() => {

// //         const onFormChange = (newState: ReactiveFormState<T, TData>) => {
// //             setState(newState);
// //         }

// //     }, []);

// //     return children({ onChange: handleChange, onBlur: handleBlur, defaultValues: state });
// // }
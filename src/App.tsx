import { useEffect, useRef } from 'react';
import './App.css'
import { useForm } from './use-form'
import { useFormReset } from './use-form-reset';
import { useFormState } from './use-form-state';
import { useFormTemplate } from './use-form-template';

const defaultFormValues = { name: "John", phone: "555-5555", email: "john@example.com" };

function App() {

  const renderCount = useRef(0);

  const formRef = useForm({ formName: "myForm", defaultValue: defaultFormValues, onSubmit: (Values) => {
    console.log(Values);
  }, validators: {
    name: (value) => {
      if (!value) return "Name is required";
      return undefined;
    },
    phone: (value) => {
      if (!value) return "Phone is required";
      return undefined;
    },
    email: (value) => {
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
      return undefined;
    }
  }})

  const state = useFormState({ formName: "myForm", defaultValue: defaultFormValues});
  const reset = useFormReset({ formName: "myForm", defaultValue: defaultFormValues});

  const templateRef = useFormTemplate({ formName: "myForm", defaultValue: defaultFormValues, transform: (key, value, isSubmitted) => {
    if (key === "phone") return `<div>Phone: ${value}</div>`;
    if (key === "email") return `<div>Email: ${value}</div>`;
    if (key === "name") return isSubmitted ? `Thanks ${value}` : `Hello ${value}!`;
    return String(value);
  }});

  useEffect(() => {
    renderCount.current++; 
    console.log('render', renderCount.current);
  })

  return (
    <>
    <div>Renders: {renderCount.current}</div>
    <form ref={formRef} style={{ textAlign: "left"}}>
      <div>
        <label style={{display: "block"}} htmlFor="name">Name</label>
        <input name="name" disabled={state?.isSubmitted} />
        <p data-validator-for="name" />
      </div>  
      <div>
        <label style={{display: "block"}} htmlFor="name">Phone</label>
        <input name="phone" disabled={state?.isSubmitted} />
        <p data-validator-for="phone" />
      </div>  
      <div>
        <label style={{display: "block"}} htmlFor="email">Email</label>
        <input name="email" disabled={state?.isSubmitted} />
        <p data-validator-for="email" />
      </div>  
      <button disabled={state?.isSubmitted} type="submit">Submit</button>
      <button type="button" style={{marginLeft: "10px"}} onClick={() => reset()}>Reset</button>
    </form>
    
    <div ref={templateRef}>
      <h5 data-bind="name" />
      <p data-bind="phone" />
      <p data-bind="email" />
    </div>
    </>
  )
}

export default App

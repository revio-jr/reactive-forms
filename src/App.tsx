import { useEffect, useRef } from 'react';
import './App.css'
import { useForm } from './use-form'
import { useFormReset } from './use-form-reset';
import { useFormState } from './use-form-state';
import { useFormValues } from './use-form-values';

const defaultFormValues = { name: "John", phone: "555-5555", email: "john@example.com" };

function App() {

  const renderCount = useRef(0);

  const formRef = useForm({ formName: "myForm", defaultValue: defaultFormValues, onSubmit: (Values) => {
    console.log(Values);
  }, validators: {
    name: (value) => {
      console.log('validating name', value);
      if (!value) return "Name is required";
      return undefined;
    },
    phone: (value) => {
      console.log('validating phone', value);
      if (!value) return "Phone is required";
      return undefined;
    },
    email: (value) => {
      console.log('validating email', value);
      if (!value) return "Email is required";
      return undefined;
    }
  }})

  const values = useFormValues({ formName: "myForm", defaultValue: defaultFormValues});
  const state = useFormState({ formName: "myForm", defaultValue: defaultFormValues});
  const reset = useFormReset({ formName: "myForm", defaultValue: defaultFormValues});

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
    </form>
    <div style={{ textAlign: "left", color: state?.isSubmitted ? "green": "grey"}}>{values.name} {values.phone} { values.email} {state?.isSubmitted ? "✅" : ""}</div>
    <button disabled={!state?.isSubmitted} onClick={() => reset()}>Reset</button>
    </>
  )
}

export default App

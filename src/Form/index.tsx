import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { generateRandomFirstName, generateRandomLastName } from "../helpers/generateRandomName";
import FieldState from "./FieldState";
import { personSchema, type Person } from "../models/person";

export default function Form() {
  const { register, control, handleSubmit, reset, trigger, setValue, // watch
    setFocus,
    formState: { errors, isDirty, isValid, isSubmitSuccessful } 
  } = useForm<Person>({
    mode: "onBlur", // When to trigger validation
    resolver: zodResolver(personSchema), defaultValues: {
      age: 18,
      gender: "m",
      addresses: [{
        country: "",
        city: "",
      }]
    } });

  const { fields, append, remove } = useFieldArray({
    name: "addresses",
    control,
  });

  React.useEffect(() => {
    setFocus("firstName")
  }, [setFocus]);

  const onSubmit = (data: Person) => {
    console.log("Submit", data);
    reset();
  }

  console.log("Errors", errors);

  // Watch firstName field changes, causes rerender
  // console.log(watch("firstName"));

  const firstName = useWatch({
    control,
    name: "firstName", // Without name supplied, will watch the entire form
  });
  console.log("firstName", firstName);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}>
        <div>
          <label>
            First name:
            <input type="text" {...register("firstName")} />
            <FieldState control={control} fieldName="firstName" />
            {/* {errors.firstName?.message} */}
          </label>
          <button type="button" onClick={() => setValue("firstName", generateRandomFirstName())}>Random</button>
        </div>
        <div>
          <label>
            Last name:
            <input type="text" {...register("lastName")} />
            <FieldState control={control} fieldName="lastName" />
          </label>
          <button type="button" onClick={() => setValue("lastName", generateRandomLastName())}>Random</button>
        </div>
        <div>
          <label>
            Age:
            <input type="number" {...register("age", { valueAsNumber: true })} min={0} />
            <FieldState control={control} fieldName="age" />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="email" {...register("email")} />
            <FieldState control={control} fieldName="email" />
          </label>
        </div>
        <div>
          <label>
            Gender:{" "}
            <label>
              Male
              <input type="radio" {...register("gender")} value="m" />
            </label>
            <label>
              Female
              <input type="radio" {...register("gender")} value="f" />
            </label>
          </label>
          <FieldState control={control} fieldName="gender" />
        </div>
        <fieldset>
          <legend>Addresses</legend>
          {
            fields.map((field, i) => 
              <div key={field.id} id={field.id}>
                <h4>Address {i + 1}</h4>
                <div>
                  Country: <input {...register(`addresses.${i}.country`)} />
                  <p className="error">
                    {errors.addresses?.[i]?.country?.message}
                  </p>
                </div>
                <div>
                  City: <input {...register(`addresses.${i}.city`)} />
                  <p className="error">
                    {errors.addresses?.[i]?.city?.message}
                  </p>
                </div>
                <button type="button" onClick={() => remove(i)}>Remove</button>
              </div>)
          }
          <button type="button" onClick={() => append({city: "", country: ""})}>Append</button>
          <FieldState control={control} fieldName="addresses" />
        </fieldset>
        
        <div>          
          <label>
            Terms & Conditions:
            <input type="checkbox" {...register("terms")} />
          </label>
          <FieldState control={control} fieldName="terms" />
          <button type="button" onClick={() => trigger(["terms"])}>Validate Terms & Conditions</button>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </div>
      <div>
        <div>Is dirty: {isDirty.toString()}</div>
        <div>Is valid: {isValid.toString()}</div>
        <div>Successful submit: {isSubmitSuccessful.toString()}</div>
      </div>
    </form>
  );
}

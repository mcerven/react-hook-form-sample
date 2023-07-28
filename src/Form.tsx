import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { generateRandomFirstName, generateRandomLastName } from "./generateRandomName";

const personSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number({required_error: "Age is required"}).min(18, "Must be at least 18 years old"),
  email: z.string().email().min(1, "Email is required"),
  gender: z.enum(["m", "f"]),
  terms: z.literal(true, {  // Field value must be exactly true
    errorMap: () => ({ message: "You must accept Terms and Conditions" }),
  }),
  addresses: z.array(
    z.object({
      country: z.string().min(1, "Country is required"),
      city: z.string().optional(),
    })
  ).min(1, "Provide at least 1 address"),
}).refine(data => !!data.firstName || !!data.lastName, {
  path: ["lastName"],
  message: "Either first or last name should be filled in."
}); // Cross field validation, triggered after all fields are valid

type Person = z.infer<typeof personSchema>;

export default function Form() {
  const { register, control, handleSubmit, watch, reset, trigger, setValue,
    formState: { errors, isDirty, isValid, isSubmitSuccessful } 
  } = useForm<Person>({
    mode: "onBlur", // when to trigger validation
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

  const onSubmit = (data: Person) => {
    console.log(data);
    reset();
  }

  console.log(errors)

  // Watch name field changes, causes rerender
  // console.log(watch("name"));

  React.useEffect(() => {
    // Watch any changes, doesn't trigger rerender
    watch((val) => {
      console.log(val)
    });
  }, [watch])
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}>
        <div>
          <label>
            First name:
            <input type="text" {...register("firstName")} />
            {errors.firstName?.message}
          </label>
          <button type="button" onClick={() => setValue("firstName", generateRandomFirstName())}>Random</button>
        </div>
        <div>
          <label>
            Last name:
            <input type="text" {...register("lastName")} />
            {errors.lastName?.message}
          </label>
          <button type="button" onClick={() => setValue("lastName", generateRandomLastName())}>Random</button>
        </div>
        <div>
          <label>
            Age:
            <input type="number" {...register("age", { valueAsNumber: true })} min={0} />
          {errors.age?.message}
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="email" {...register("email")} />
            {errors.email?.message}
          </label>
        </div>
        <div>
          <label>
            Gender:
            <label>
              Male
              <input type="radio" {...register("gender")} value="m" />
            </label>
            <label>
              Female
              <input type="radio" {...register("gender")} value="f" />
            </label>
          </label>
          {errors.gender?.message}
        </div>
        <fieldset>
          <legend>Addesses</legend>
          {
            fields.map((field, i) => 
              <div id={field.id}>
                <h4>Address {i + 1}</h4>
                <div>
                  Country: <input {...register(`addresses.${i}.country`)} />
                  {errors.addresses?.[i]?.country?.message}
                </div>
                <div>
                  City: <input {...register(`addresses.${i}.city`)} />
                  {errors.addresses?.[i]?.city?.message}
                </div>
                <button type="button" onClick={() => remove(i)}>Remove</button>
              </div>)
          }
          <button type="button" onClick={() => append({city: "", country: ""})}>Append</button>
          {errors.addresses?.message}
        </fieldset>
        
        <div>          
          <label>
            Terms:
            <input type="checkbox" {...register("terms")} />
          </label>
          {errors.terms?.message}
        </div>
        <div>
          <button type="button" onClick={() => trigger(["firstName", "lastName", "age", "addresses"])}>Validate</button>
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

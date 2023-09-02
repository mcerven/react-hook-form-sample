import { z } from "zod";

export const personSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.coerce.number({
    invalid_type_error: "Must be at least 18 years old",
  }).min(18, "Must be at least 18 years old"),
  email: z.string().email().min(1, "Email is required"),
  gender: z.enum(["m", "f"]),
  terms: z.literal(true, {
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

export type Person = z.infer<typeof personSchema>;

import { Control, FieldErrors, useFormState } from 'react-hook-form'
import type { Person } from "./person";

interface FieldStateProps {
  control: Control<Person>;
  fieldName: keyof FieldErrors<Person>;
}

export default function FieldState({ control, fieldName }: FieldStateProps) {
  const { errors } = useFormState({
    control
  });

  return <p className="error">{errors[fieldName]?.message}</p>;
}

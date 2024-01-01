import type { FormFieldViewModel } from "react-model-view-viewmodel";
import type { ValidationResult } from "./ValidationResult";

export function required(field: FormFieldViewModel<string | null | undefined>): ValidationResult {
  if (field.value === null || field.value === undefined || field.value.length === 0 || field.value.trim().length === 0)
    return "field.required";
}
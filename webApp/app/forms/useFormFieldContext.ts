import { useContext } from "react";
import { type IFormFieldContext, FormFieldContext } from "./FormFieldContext";

export function useFormFieldContext<T>(): IFormFieldContext<T> {
  return useContext(FormFieldContext)!;
}
import type { BillPathFormFieldViewModel } from "./viewModels";
import { createContext } from "react";

export interface IFormFieldContext<T> {
  readonly field: BillPathFormFieldViewModel<T>;
}

export const FormFieldContext = createContext<IFormFieldContext<any> | null>(null);
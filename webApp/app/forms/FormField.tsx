import { FieldProps, Field } from "@fluentui/react-components";
import { useViewModel } from "react-model-view-viewmodel";
import { useMemo } from "react";
import { type IFormFieldContext, FormFieldContext } from "./FormFieldContext";
import { BillPathFormFieldViewModel } from "./viewModels";
import { useValidationMessage } from "./useValidationMessage";

export interface IFormFieldProps<T> extends Omit<FieldProps, "validationState" | "validationMessage"> {
  readonly field: BillPathFormFieldViewModel<T>;
}

export function FormField<T>({ field, ...otherFieldProps }: IFormFieldProps<T>) {
  useViewModel(field, ["isTouched", "isValid"]);

  const formFieldContext = useMemo<IFormFieldContext<T>>(
    () => ({
      field
    }),
    [field]
  );

  const validationMessage = useValidationMessage(field);

  return (
    <FormFieldContext.Provider value={formFieldContext}>
      <Field
        validationState={field.isTouched ? (field.isValid ? "success" : "error") : "none"}
        validationMessage={validationMessage}
        {...otherFieldProps} />
    </FormFieldContext.Provider>
  );
}
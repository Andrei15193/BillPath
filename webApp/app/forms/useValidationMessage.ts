import type { ValidationResult } from "./validators";
import type { BillPathFormFieldViewModel } from "./viewModels";
import { type IntlShape, useIntl } from "react-intl";
import { useViewModel } from "react-model-view-viewmodel";

export function useValidationMessage(field: BillPathFormFieldViewModel<any>): string | undefined {
  const intl = useIntl();
  useViewModel(field, ["isTouched", "isInvalid"]);

  if (field.isTouched && field.isInvalid) {
    const validationResultMessageProvider = validationResultsMap.get(field.error!)!;
    return validationResultMessageProvider(intl, field);
  }
  else
    return undefined;
}

const validationResultsMap = new Map<NonNullable<ValidationResult>, (intl: IntlShape, field: BillPathFormFieldViewModel<any>) => string>();
validationResultsMap.set("field.required", (intl) => intl.formatMessage({
  defaultMessage: "Please provide a value.",
  description: "Form field is required."
}));
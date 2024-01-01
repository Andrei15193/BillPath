import { type InputProps, type InputOnChangeData, Input } from "@fluentui/react-components";
import { type ChangeEvent, type FocusEventHandler, useCallback } from "react";
import { useViewModel } from "react-model-view-viewmodel";
import { useFormFieldContext } from "./useFormFieldContext";

export interface IFormInputFieldProps extends Omit<InputProps, "value" | "defaultValue"> {
}

export function FormInputField({ onChange, onFocus, ...otherInputProps }: IFormInputFieldProps): JSX.Element {
  const { field } = useFormFieldContext<string>();
  useViewModel(field);

  const onFocusCallback = useCallback<FocusEventHandler<HTMLInputElement>>(
    (event) => {
      onFocus && onFocus(event);

      if (!event.defaultPrevented)
        field.isTouched = true;
    },
    [onFocus]
  );

  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
      onChange && onChange(event, data);

      if (!event.defaultPrevented)
        field.value = data.value;
    },
    [field, onChange]
  );

  return (
    <Input value={field.value} onFocus={onFocusCallback} onChange={onChangeCallback} {...otherInputProps} />
  );
}
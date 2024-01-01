import type { BillPathFormFieldViewModel } from "./BillPathFormFieldViewModel";
import { FormFieldCollectionViewModel } from "react-model-view-viewmodel";

export class BillPathFormFieldCollectionViewModel extends FormFieldCollectionViewModel<BillPathFormFieldViewModel<any>> {
  public validateWithTouch(): boolean {
    this.fields.forEach(field => {
      field.isTouched = true;
    });

    return this.isValid;
  }
}
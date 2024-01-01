import { type IFormFieldViewModelConfig, FormFieldViewModel } from "react-model-view-viewmodel";
import { ValidationResult } from "../validators";

export interface IBillPathFormFieldViewModelConfig<TValue> extends IFormFieldViewModelConfig<TValue> {
  readonly isTouched?: boolean;
}

export class BillPathFormFieldViewModel<TValue> extends FormFieldViewModel<TValue> {
  private _isTouchedOverride: boolean;
  private _errorOverride: ValidationResult = undefined;

  public constructor(config: IBillPathFormFieldViewModelConfig<TValue>) {
    super(config);

    const { isTouched = false } = config;
    this._isTouchedOverride = isTouched;
  }

  public get isTouched(): boolean {
    return this._isTouchedOverride;
  }

  public set isTouched(value: boolean) {
    if (this._isTouchedOverride !== value) {
      this._isTouchedOverride = value;
      this.notifyPropertiesChanged("isTouched");
    }
  }

  public get isValid(): boolean {
    return this._errorOverride === null || this._errorOverride === undefined;
  }

  public get isInvalid(): boolean {
    return this._errorOverride !== null && this._errorOverride !== undefined;
  }

  public get error(): ValidationResult {
    return this._errorOverride;
  }

  public set error(value: ValidationResult | undefined) {
    if (this._errorOverride !== value) {
      this._errorOverride = value;
      this.notifyPropertiesChanged("error", "isValid", "isInvalid");
    }
  }
}
import type { IObservedItem, ObservedItemState } from "./IObservedItem";
import { ViewModel } from "react-model-view-viewmodel";

export class ObservedItem<T> extends ViewModel implements IObservedItem<T> {
  private _state: ObservedItemState;

  public constructor(item: T) {
    super();

    this.item = item;
    this._state = "unchanged";

    this.clearState = this.clearState.bind(this);
  }

  public changeToken: any = {};

  public readonly item: T;

  public get state(): ObservedItemState {
    return this._state;
  }

  public set state(value: ObservedItemState) {
    if (this._state !== value) {
      this._state = value;
      this.notifyPropertiesChanged("state", "added", "updated", "removed");
    }
  }

  public clearState(): void {
    this.state = "unchanged";
  }

  public get added(): boolean {
    return this._state === "added";
  }

  public get updated(): boolean {
    return this._state === "updated";
  }

  public get removed(): boolean {
    return this._state === "removed";
  }
}
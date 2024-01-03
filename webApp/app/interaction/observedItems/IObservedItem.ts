import type { INotifyPropertiesChanged } from "react-model-view-viewmodel";

export interface IObservedItem<T> extends INotifyPropertiesChanged {
  readonly item: T;

  get state(): ObservedItemState;
  set state(value: Extract<ObservedItemState, "unchanged">);
  clearState(): void;

  readonly added: boolean;
  readonly updated: boolean;
  readonly removed: boolean;
}

export type ObservedItemState = "unchanged" | "added" | "updated" | "removed";
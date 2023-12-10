export interface IOverlayLoader {
  showAsync(): Promise<void>;
  hideAsync(): Promise<void>;
}
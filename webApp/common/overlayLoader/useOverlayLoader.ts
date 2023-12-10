import type { IOverlayLoader } from "./IOverlayLoader";
import { OverlayLoader } from "./OverlayLoader";

export function useOverlayLoader(): IOverlayLoader {
  return OverlayLoader.instance;
}
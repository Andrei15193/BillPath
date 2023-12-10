import type { ILanguagePreferenceViewModel } from "./ILanguagePreferenceViewModel";
import { useContext } from "react";
import { LanguagePreferenceContext } from "./LanguagePreferenceContext";

export function useLanguagePreferenceViewModel(): ILanguagePreferenceViewModel {
  return useContext(LanguagePreferenceContext);
}
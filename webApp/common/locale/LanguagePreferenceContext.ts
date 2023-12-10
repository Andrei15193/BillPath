import type { ILanguagePreferenceViewModel } from "./ILanguagePreferenceViewModel";
import { createContext } from "react";
import { LanguagePreferenceViewModel } from "./LanguagePreferenceViewModel";

export const LanguagePreferenceContext = createContext<ILanguagePreferenceViewModel>(new LanguagePreferenceViewModel());
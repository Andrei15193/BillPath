import type { I18nMessages, ILocale } from "./ILocale";
import { type PropsWithChildren, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { useOverlayLoader } from "../overlayLoader";
import { useViewModelDependency } from "../dependencies";
import { resolveLocale } from "./resolveLocale";
import { LanguagePreferenceViewModel } from "./LanguagePreferenceViewModel";

export const DefaultLocale = "en-US";

interface ILoadedLocale {
  readonly id: string;
  readonly messages: I18nMessages;
}

export interface ILocaleProviderProps {
}

export function LocaleProvider({ children }: PropsWithChildren<ILocaleProviderProps>): JSX.Element | null {
  const languagePreferenceViewModel = useViewModelDependency(LanguagePreferenceViewModel, ["preferredLanguage"]);

  const overlayLoader = useOverlayLoader();

  const [locale, setLocale] = useState<ILocale>(resolveLocale(languagePreferenceViewModel.preferredLanguage === null ? navigator.languages : [languagePreferenceViewModel.preferredLanguage], DefaultLocale));
  const [loadedLocale, setLoadedLocale] = useState<ILoadedLocale | null>(null);

  useEffect(
    () => {
      if (languagePreferenceViewModel.preferredLanguage === null) {
        window.onlanguagechange = event => {
          if (!event.defaultPrevented)
            setLocale(resolveLocale(navigator.languages, DefaultLocale));
        };
        setLocale(resolveLocale(navigator.languages, DefaultLocale));
      }
      else
        setLocale(resolveLocale([languagePreferenceViewModel.preferredLanguage], DefaultLocale));

      return () => {
        window.onlanguagechange = null;
      }
    },
    [languagePreferenceViewModel.preferredLanguage, setLocale]
  );

  useEffect(
    () => {
      overlayLoader
        .showAsync()
        .then(() => locale.resolveMessagesAsync()
          .then((messages) => {
            setLoadedLocale({ id: locale.id, messages });
            document.body.parentElement?.setAttribute("lang", locale.id);

            return overlayLoader.hideAsync();
          })
        );

      return () => {
        document.body.parentElement?.removeAttribute("lang");
      }
    },
    [locale, overlayLoader]
  );

  if (loadedLocale === null)
    return null;

  return (
    <IntlProvider locale={loadedLocale.id} messages={loadedLocale.messages} defaultLocale={DefaultLocale}>
      {children}
    </IntlProvider>
  );
}
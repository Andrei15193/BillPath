import type { I18nMessages, ILocale } from "./ILocale";
import { type PropsWithChildren, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { useViewModel } from "react-model-view-viewmodel";
import { useOverlayLoader } from "../overlayLoader";
import { useLanguagePreferenceViewModel } from "./useLanguagePreferenceViewModel";
import { resolveLocale } from "./resolveLocale";

const defaultLocale = "en-US";

interface ILoadedLocale {
  readonly id: string;
  readonly messages: I18nMessages;
}

export interface ILocaleProviderProps {
}

export function LocaleProvider({ children }: PropsWithChildren<ILocaleProviderProps>): JSX.Element | null {
  const languagePreferenceViewModel = useLanguagePreferenceViewModel();
  useViewModel(languagePreferenceViewModel);

  const overlayLoader = useOverlayLoader();

  const [locale, setLocale] = useState<ILocale>(resolveLocale(languagePreferenceViewModel.preferredLanguage === null ? navigator.languages : [languagePreferenceViewModel.preferredLanguage], defaultLocale));
  const [loadedLocale, setLoadedLocale] = useState<ILoadedLocale | null>(null);

  useEffect(
    () => {
      if (languagePreferenceViewModel.preferredLanguage === null) {
        window.onlanguagechange = event => {
          if (!event.defaultPrevented)
            setLocale(resolveLocale(navigator.languages, defaultLocale));
        };
        setLocale(resolveLocale(navigator.languages, defaultLocale));
      }
      else
        setLocale(resolveLocale([languagePreferenceViewModel.preferredLanguage], defaultLocale));

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
    <IntlProvider locale={loadedLocale.id} messages={loadedLocale.messages} defaultLocale={defaultLocale}>
      {children}
    </IntlProvider>
  );
}
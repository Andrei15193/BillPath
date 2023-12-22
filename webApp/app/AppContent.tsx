import { Select, Title1, makeResetStyles, mergeClasses, shorthands } from "@fluentui/react-components";
import { FormattedMessage } from "react-intl";
import { useViewModel } from "react-model-view-viewmodel";
import { useContentClassNames } from "../common/theme/styles";
import { AppTheme } from "../common/theme";
import { useDependency } from "../common/dependencies";
import { LanguagePreferenceViewModel } from "../common/locale/LanguagePreferenceViewModel";
import { AppThemeViewModel } from "../common/theme/AppThemeViewModel";

const useAppContentClassName = makeResetStyles({
  ...shorthands.flex(1, 1, "auto")
})

export function AppContent(): JSX.Element {
  const { marginContentClassName } = useContentClassNames();
  const appContentClassName = useAppContentClassName();

  const languagePreferenceViewModel = useDependency(LanguagePreferenceViewModel);
  useViewModel(languagePreferenceViewModel);

  const appThemeViewModel = useDependency(AppThemeViewModel);
  useViewModel(appThemeViewModel);

  return (
    <div className={mergeClasses(marginContentClassName, appContentClassName)}>
      <div>
        <Title1>
          <FormattedMessage defaultMessage="Expenses" description="Expenses list view title." />
        </Title1>
      </div>

      <label htmlFor="language-select">
        <FormattedMessage defaultMessage="Language" description="The select label for the language picker." />
      </label>
      <Select
        id="language-select"
        value={languagePreferenceViewModel.preferredLanguage === null ? "" : languagePreferenceViewModel.preferredLanguage}
        onChange={(event, { value }) => { languagePreferenceViewModel.preferredLanguage = (value === "" ? null : value) }}>
        <option value="">
          <FormattedMessage defaultMessage="Web Browser Prefernece"  description="Default option for language selection, the user can always go back to have the language picked form their browser." />
        </option>
        {
          languagePreferenceViewModel.supportedLocales.map(locale => (
            <option key={locale.id} value={locale.id}>
              {locale.displayName}
            </option>
          ))
        }
      </Select>

      <label htmlFor="theme-select">
        <FormattedMessage defaultMessage="Theme" description="The select label for the theme picker." />
      </label>
      <Select
        id="theme-select"
        value={appThemeViewModel.preferredTheme || ""}
        onChange={(event, { value }) => { appThemeViewModel.preferredTheme = value === "" ? null : value as AppTheme }}>
        <option value="">
          <FormattedMessage defaultMessage="Web Browser Prefernece"  description="Default option for theme selection, the user can always go back to have the theme picked form their browser." />
        </option>
        <option value={AppTheme.light}>
          <FormattedMessage defaultMessage="Light" description="Light theme name in theme select dropdown." />
        </option>
        <option value={AppTheme.dark}>
          <FormattedMessage defaultMessage="Dark" description="Dark theme name in theme select dropdown." />
        </option>
      </Select>
    </div>
  );
}
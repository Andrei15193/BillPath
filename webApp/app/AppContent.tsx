import { Select, Title1, makeResetStyles, mergeClasses, shorthands } from "@fluentui/react-components";
import { FormattedMessage } from "react-intl";
import { useViewModel } from "react-model-view-viewmodel";
import { useContentClassNames } from "../common/theme/styles";
import { useLanguagePreferenceViewModel } from "../common/locale";

const useAppContentClassName = makeResetStyles({
  ...shorthands.flex(1, 1, "auto")
})

export function AppContent(): JSX.Element {
  const { marginContentClassName } = useContentClassNames();
  const appContentClassName = useAppContentClassName();

  const languagePreferenceViewModel = useLanguagePreferenceViewModel();
  useViewModel(languagePreferenceViewModel);

  return (
    <div className={mergeClasses(marginContentClassName, appContentClassName)}>
      <div>
        <Title1>
          <FormattedMessage defaultMessage="Expenses" description="Expenses list view title" />
        </Title1>
      </div>

      <label htmlFor="language-select">
        <FormattedMessage defaultMessage="Language" />
      </label>
      <Select
        id="language-select"
        value={languagePreferenceViewModel.preferredLanguage === null ? "" : languagePreferenceViewModel.preferredLanguage}
        onChange={(event, { value }) => { languagePreferenceViewModel.preferredLanguage = (value === "" ? null : value) }}>
        <option value="">
          <FormattedMessage defaultMessage="Browser" />
        </option>
        {
          languagePreferenceViewModel.supportedLocales.map(locale => (
            <option key={locale.id} value={locale.id}>
              {locale.displayName}
            </option>
          ))
        }
      </Select>
    </div>
  );
}
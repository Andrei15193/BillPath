import { Caption1, Divider, makeResetStyles, shorthands, tokens } from "@fluentui/react-components";
import { FormattedMessage } from "react-intl";

const useAppFooterClassName = makeResetStyles({
  ...shorthands.margin(tokens.spacingVerticalS, tokens.spacingVerticalXL)
});

export function AppFooter(): JSX.Element {
  const appFooterClassName = useAppFooterClassName();

  return (
    <div>
      <Divider />
      <Caption1 block align="center" className={appFooterClassName}>
        <FormattedMessage defaultMessage="BillPath © {year} Andrei15193" description="Copyright notice" values={{ year: new Date().getFullYear() }} />
      </Caption1>
    </div>
  );
}
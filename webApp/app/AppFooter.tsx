import { Caption1, Divider, makeResetStyles, shorthands, tokens } from "@fluentui/react-components";

const useAppFooterClassName = makeResetStyles({
  ...shorthands.margin(tokens.spacingVerticalS, tokens.spacingVerticalXL)
})

export function AppFooter(): JSX.Element {
  const appFooterClassName = useAppFooterClassName();

  return (
    <div>
      <Divider />
      <Caption1 block align="center" className={appFooterClassName}>
        BillPath &copy; {new Date().getFullYear()} Andrei15193
      </Caption1>
    </div>
  );
}

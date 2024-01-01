import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useContentClassNames = makeStyles({
  marginContentClassName: {
    ...shorthands.margin(tokens.spacingVerticalXL)
  }
});
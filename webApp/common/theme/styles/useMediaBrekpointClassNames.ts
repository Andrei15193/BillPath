import { makeStyles } from "@fluentui/react-components";

export const useMediaBrekpointClasses = makeStyles({
  largeDisplayClassName: {
    "@media (max-width: 1023px)": {
      display: "none"
    }
  },
  smallDisplayClassName: {
    "@media (min-width: 1024px)": {
      display: "none"
    }
  }
});
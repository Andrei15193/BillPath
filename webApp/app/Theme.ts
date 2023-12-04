import { type BrandVariants, type Theme, createLightTheme, createDarkTheme } from "@fluentui/react-components";

const billPathTheme: BrandVariants = {
  10: "#060103",
  20: "#260F18",
  30: "#421525",
  40: "#58192F",
  50: "#6E1E38",
  60: "#842541",
  70: "#992D49",
  80: "#AD3751",
  90: "#C14359",
  100: "#D45061",
  110: "#E65F69",
  120: "#F76E71",
  130: "#FF847F",
  140: "#FF9D92",
  150: "#FFB4A8",
  160: "#FFCABF"
};

export const billPathLightTheme: Theme = {
  ...createLightTheme(billPathTheme)
};

export const billPathDarkTheme: Theme = {
  ...createDarkTheme(billPathTheme),
};

billPathDarkTheme.colorBrandForeground1 = billPathTheme[110];
billPathDarkTheme.colorBrandForeground2 = billPathTheme[120];
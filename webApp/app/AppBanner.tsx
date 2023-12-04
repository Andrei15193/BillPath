import { Card, CardFooter, CardHeader, CardPreview, Display, makeResetStyles, makeStyles, mergeClasses, shorthands, tokens } from "@fluentui/react-components";
import banner from "../assets/banner.png";
import { useMediaBrekpointClasses } from "./styles";

const useAppBannerClasses = makeStyles({
  cardClassName: {
    ...shorthands.margin(tokens.spacingVerticalXL, tokens.spacingVerticalXL, 0)
  },
  cardPreviewClassName: {
    height: "300px"
  }
});

export function AppBanner(): JSX.Element {
  const { largeDisplayClassName, smallDisplayClassName } = useMediaBrekpointClasses();
  const { cardClassName, cardPreviewClassName } = useAppBannerClasses();

  return (
    <>
      <Card className={mergeClasses(largeDisplayClassName, cardClassName)}>
        <CardHeader />

        <CardPreview className={cardPreviewClassName}>
          <AppBannerContent />
        </CardPreview>

        <CardFooter />
      </Card>

      <div className={smallDisplayClassName}>
        <AppBannerContent />
      </div>
    </>
  );
}

const useAppBannerContentClassName = makeResetStyles({
  ...shorthands.padding(0, tokens.spacingVerticalXL),
  height: "300px",

  backgroundImage: `url('${banner}')`,
  backgroundPositionX: "center",
  backgroundPositionY: "center",

  color: tokens.colorNeutralForegroundInverted
});

function AppBannerContent(): JSX.Element {
  const bannerContentClassName = useAppBannerContentClassName();

  return (
    <div className={bannerContentClassName}>
      <Display>BillPath</Display>
    </div>
  );
}
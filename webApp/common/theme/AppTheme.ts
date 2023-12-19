/**
 * Values are also used in [`index.html`](../../index.html)
 *
 * @default AppTheme.light
 */
export enum AppTheme {
  light = "light",
  dark = "dark"
}

export function mapAppTheme(value: string | null | undefined): AppTheme {
  switch (value) {
    case AppTheme.dark:
      return AppTheme.dark;

    case AppTheme.light:
    default:
      return AppTheme.light;
  }
}
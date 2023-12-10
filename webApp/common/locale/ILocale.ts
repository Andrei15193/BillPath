import type * as i18nMessages from "../../i18n/en-US.json";

export type I18nMessages = Readonly<Record<keyof typeof i18nMessages, string>>;

export interface ILocale {
  readonly id: string;
  readonly displayName: string;

  resolveMessagesAsync(): Promise<I18nMessages>;
}
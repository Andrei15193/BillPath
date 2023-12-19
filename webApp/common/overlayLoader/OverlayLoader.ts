import type { IOverlayLoader } from "./IOverlayLoader";
import { FakePromise } from "../promises";
import { AppTheme, mapAppTheme } from "../theme";

/**
 * Estimated animation duration, these do not have to match CSS animation length.
 * Small delays (under 1 second) may be intentionally added to make the effect more pleasing.
 */
export interface IOverlayLoaderOptions {
  readonly visibilityAnimationDurationInMilliseconds: number;
  readonly themeSwitchAnimationDurationInMilliseconds: number;
}

export class OverlayLoader implements IOverlayLoader {
  public static readonly instance: OverlayLoader = new OverlayLoader({
    visibilityAnimationDurationInMilliseconds: 400,
    themeSwitchAnimationDurationInMilliseconds: 1300
  });

  private _loadRequestCount: number;
  private _showPromise: FakePromise<void>;
  private _resolveShowPromiseTimeout: any | null;
  private _hidePromise: FakePromise<void>;
  private _resolveHidePromiseTimeout: any | null;
  private _appTheme: AppTheme;
  private _pendingAppTheme: AppTheme | null;
  private _appThemeSwitchPromise: FakePromise<void>;
  private readonly _overlayLoaderElement = document.getElementById("overlay-loader")!;
  private readonly _options: IOverlayLoaderOptions;

  public constructor(options: IOverlayLoaderOptions) {
    this._options = options;

    this._loadRequestCount = 0;
    this._showPromise = new FakePromise<void>();
    this._showPromise.resolve();

    this._hidePromise = new FakePromise<void>();
    this._hidePromise.resolve();
    this._resolveHidePromiseTimeout = null;

    const storedTheme = localStorage.getItem("preferrences/theme");
    this._appTheme = mapAppTheme(storedTheme);
    this._pendingAppTheme = null;
    this._appThemeSwitchPromise = new FakePromise<void>();
    this._appThemeSwitchPromise.resolve();

    document.body.addEventListener(
      "keydown",
      event => {
        if (this._overlayLoaderElement.className.indexOf("active") >= 0) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      {
        capture: true
      }
    );
  }

  public get appTheme(): AppTheme {
    if (this._pendingAppTheme !== null)
      return this._pendingAppTheme;
    else
      return this._appTheme;
  }

  public set appTheme(value: AppTheme) {
    if (this._appTheme !== value)
      this._pendingAppTheme = value;
  }

  public async showAsync(): Promise<void> {
    if (this._resolveHidePromiseTimeout !== null) {
      clearTimeout(this._resolveHidePromiseTimeout);
      this._resolveHidePromiseTimeout = null;
    }

    this._loadRequestCount++;
    if (this._loadRequestCount === 1) {
      this._overlayLoaderElement.setAttribute("class", `active animated ${this._getThemeClassName()}`);

      this._showPromise = new FakePromise<void>();
      this._resolveShowPromiseTimeout = setTimeout(
        () => {
          this._resolveShowPromiseTimeout = null;
          if (this._showPromise !== null)
            this._showPromise.resolve();
        },
        this._options.visibilityAnimationDurationInMilliseconds
      );
    }

    if (this._pendingAppTheme !== null) {
      this._appTheme = this._pendingAppTheme!;
      this._pendingAppTheme = null;
      this._appThemeSwitchPromise = new FakePromise<void>();

      await this._showPromise;

      this._overlayLoaderElement.setAttribute("class", `active animated ${this._getThemeClassName()}`);
      setTimeout(() => this._appThemeSwitchPromise.resolve(), this._options.themeSwitchAnimationDurationInMilliseconds);
    }
    else
      await this._showPromise;
  }

  public async hideAsync(): Promise<void> {
    if (this._loadRequestCount === 0)
      throw new Error("Cannot hide the overlay loader more times than it has been shown.");

    this._loadRequestCount--;
    if (this._loadRequestCount === 0) {
      this._hidePromise = new FakePromise<void>();

      if (this._resolveShowPromiseTimeout !== null) {
        clearTimeout(this._resolveShowPromiseTimeout);
        this._resolveShowPromiseTimeout = null;
        this._showPromise.reject();
      }
      else
        await this._appThemeSwitchPromise;

      this._overlayLoaderElement.setAttribute("class", `animated ${this._getThemeClassName()}`);
      this._resolveHidePromiseTimeout = setTimeout(
        () => {
          this._hidePromise.resolve();
          this._overlayLoaderElement.setAttribute("class", this._getThemeClassName());
        },
        this._options.visibilityAnimationDurationInMilliseconds
      );
    }

    return this._hidePromise;
  }

  private _getThemeClassName(): string {
    switch (this._appTheme) {
      case AppTheme.light:
        return "light";

      case AppTheme.dark:
        return "dark";
    }
  }
}
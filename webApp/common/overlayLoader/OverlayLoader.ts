import type { IOverlayLoader } from "./IOverlayLoader";
import { FakePromise } from "../promises";

export class OverlayLoader implements IOverlayLoader {
  public static readonly instance: OverlayLoader = new OverlayLoader(300);

  private _loadRequestCount: number;
  private _showPromise: FakePromise<void> | null;
  private _resolveShowPromiseTimeout: any | null;
  private _hidePromise: FakePromise<void> | null;
  private _resolveHidePromiseTimeout: any | null;
  private readonly _overlayLoaderElement = document.getElementById("overlay-loader")!;
  private readonly _visibilityAnimationDurationInMilliseconds;

  public constructor(visibilityAnimationDurationInMilliseconds: number) {
    this._visibilityAnimationDurationInMilliseconds = visibilityAnimationDurationInMilliseconds;

    this._loadRequestCount = 0;
    this._showPromise = new FakePromise<void>();
    this._showPromise.resolve();

    this._hidePromise = null;
    this._resolveHidePromiseTimeout = null;
  }

  public async showAsync(): Promise<void> {
    if (this._resolveHidePromiseTimeout !== null) {
      clearTimeout(this._resolveHidePromiseTimeout);
      this._resolveHidePromiseTimeout = null;
    }

    this._loadRequestCount++;
    if (this._loadRequestCount === 1) {
      this._overlayLoaderElement.setAttribute("class", "active");

      this._showPromise = new FakePromise<void>();
      this._resolveShowPromiseTimeout = setTimeout(
        () => {
          this._resolveShowPromiseTimeout = null;
          if (this._showPromise !== null)
            this._showPromise.resolve();
        },
        this._visibilityAnimationDurationInMilliseconds
      );
    }

    await this._showPromise;
  }

  public async hideAsync(): Promise<void> {
    if (this._loadRequestCount === 0)
      throw new Error("Cannot hide the overlay loader more times than it has been shown.");

    if (this._hidePromise === null)
      this._hidePromise = new FakePromise<void>();

    this._loadRequestCount--;
    if (this._loadRequestCount === 0) {
      this._overlayLoaderElement.removeAttribute("class");

      if (this._showPromise !== null) {
        this._showPromise.reject();
        this._showPromise = null;

        if (this._resolveShowPromiseTimeout!== null){
          clearTimeout(this._resolveShowPromiseTimeout);
          this._resolveShowPromiseTimeout = null;
        }
      }

      this._resolveHidePromiseTimeout = setTimeout(
        () => {
          this._hidePromise!.resolve();
          this._hidePromise = null;
          this._overlayLoaderElement.setAttribute("class", "no-animation");
        },
        this._visibilityAnimationDurationInMilliseconds
      );
    }

    return this._hidePromise;
  }
}
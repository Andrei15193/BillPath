export class FakePromise<TResult = void> implements Promise<TResult> {
  private _completed: boolean = false;
  private _resolved: boolean = false;
  private _rejected: boolean = false;
  private _resolve: ((value: TResult | PromiseLike<TResult>) => void) | null = null;
  private _reject: ((reason?: any) => void) | null = null;
  private readonly _promise: Promise<TResult>;

  public constructor() {
    this._promise = new Promise<TResult>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  public get completed(): boolean {
    return this._completed;
  }

  public get resolved(): boolean {
    return this._resolved;
  }

  public get rejected(): boolean {
    return this._rejected;
  }

  public resolve(value: TResult | PromiseLike<TResult>): void {
    if (!this._completed) {
      this._completed  = true;
      this._resolved = true;
      this._resolve!(value);
    }
  }

  public reject(reason?: any): void {
    if (!this._completed) {
      this._completed = true;
      this._rejected = true;
      this!._reject!(reason);
    }
  }

  public then<TFulfilledResult = TResult, TRejectedResult = never>(onfulfilled?: ((value: TResult) => TFulfilledResult | PromiseLike<TFulfilledResult>) | null | undefined, onrejected?: ((reason: any) => TRejectedResult | PromiseLike<TRejectedResult>) | null | undefined): Promise<TFulfilledResult | TRejectedResult> {
    return this._promise.then(onfulfilled, onrejected);
  }

  public catch<TRejectedResult = never>(onrejected?: ((reason: any) => TRejectedResult | PromiseLike<TRejectedResult>) | null | undefined): Promise<TResult | TRejectedResult> {
    return this._promise.catch(onrejected);
  }

  public finally(onfinally?: (() => void) | null | undefined): Promise<TResult> {
    return this._promise.finally(onfinally);
  }

  public get [Symbol.toStringTag](): string {
    return this._promise[Symbol.toStringTag];
  }
}
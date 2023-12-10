export class FakePromise<TResult = void> implements Promise<TResult> {
  private _finished: boolean = false;
  private _resolve: ((value: TResult | PromiseLike<TResult>) => void) | null = null;
  private _reject: ((reason?: any) => void) | null = null;
  private readonly _promise: Promise<TResult>;

  public constructor() {
    this._promise = new Promise<TResult>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  public resolve(value: TResult | PromiseLike<TResult>): void {
    if (!this._finished) {
      this._finished  = true;
      this._resolve!(value);
    }
  }

  public reject(reason?: any): void {
    if (!this._finished) {
      this._finished = true;
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
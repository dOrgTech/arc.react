// TODO: wrong addresses, incompatible contracts, etc
export class CodeLogs {

  public get error(): Error | undefined {
    return this._error;
  }

  private _error?: Error;

  constructor() { }

  public creationFailed(error: Error) {
    this._error = error;
  }
}

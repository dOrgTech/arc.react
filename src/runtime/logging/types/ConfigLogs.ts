export class ConfigLogs {
  public get createTime(): number | undefined {
    return this._createTime;
  }
  public get error(): Error | undefined {
    return this._error;
  }

  private _createTime: number | undefined;
  private _error?: Error;

  constructor() {
    this._createTime = -1;
  }

  public connectionStarted() {
    this._createTime = Date.now();
    this._error = undefined;
  }

  public connectionFailed(error: Error) {
    this._createTime = undefined;
    this._error = error;
  }
}

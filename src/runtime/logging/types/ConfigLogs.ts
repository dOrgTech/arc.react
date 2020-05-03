export class ConfigLogs {
  public get createTime(): number | undefined {
    return this._createTime;
  }
  public get error(): Error | undefined {
    return this._error;
  }

  public get connected(): boolean | undefined {
    return this._connected;
  }

  private _createTime: number | undefined;
  private _connected: boolean;
  private _error?: Error;

  constructor() {
    this._createTime = -1;
    this._connected = false;
    this._error = undefined;
  }

  public initializeStarted() {
    this._connected = false;
    this._error = new Error("Connecting...");
  }

  public initializeCompleted() {
    this._createTime = Date.now();
    this._connected = true;
    this._error = undefined;
  }

  public initializeFailed(error: Error) {
    this._createTime = undefined;
    this._error = error;
  }
}

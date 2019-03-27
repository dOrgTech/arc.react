export class DataLogs {

  public get createTime(): number {
    return this._createTime;
  }

  public get queryCount(): number {
    return this._queryCount;
  }

  public get dataReceived(): boolean {
    return this._dataReceived;
  }

  public get queryComplete(): boolean {
    return this._queryComplete;
  }

  public get error(): Error | undefined {
    return this._error;
  }

  private _createTime: number;
  private _queryCount: number;
  private _dataReceived: boolean;
  private _queryComplete: boolean;
  private _error?: Error;

  constructor() {
    this._createTime = -1;
    this._queryCount = 0;
    this._dataReceived = false;
    this._queryComplete = false;
  }

  public queryStarted() {
    this._createTime = Date.now();
    this._queryCount = ++this._queryCount;
    this._dataReceived = false;
    this._queryComplete = false;
    this._error = undefined;
  }

  public queryReceivedData() {
    this._dataReceived = true;
  }

  public queryCompleted() {
    this._queryComplete = true;
  }

  public queryFailed(error: Error) {
    this._error = error;
  }
}

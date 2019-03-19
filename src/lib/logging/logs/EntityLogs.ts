export class EntityLogs {

  public get createTime(): number {
    return this._createTime;
  }

  public get createCount(): number {
    return this._createCount;
  }

  public get error(): Error | undefined {
    return this._error;
  }

  private _createTime: number;
  private _createCount: number;
  private _error?: Error;

  constructor() {
    this._createTime = -1;
    this._createCount = 0;
  }

  public created() {
    this._createTime = Date.now();
    this._createCount = ++this._createCount;
    this._error = undefined;
  }

  public creationFailed(error: Error) {
    this._error = error;
  }
}

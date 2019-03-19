export class ReactLogs {

  public get renderCount(): number {
    return this._renderCount;
  }

  private _renderCount: number;

  constructor() {
    this._renderCount = 0;
  }

  public rendered() {
    ++this._renderCount;
  }
}

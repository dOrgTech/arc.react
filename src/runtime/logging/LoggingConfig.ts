export class LoggingConfig
{
  constructor (
    public enabled: boolean
  ) { }

  public static get Current() {
    if (!this._current) {
      this._current = this.OnConfig;
    }

    return this._current;
  }

  public static OnConfig = new LoggingConfig(true);
  public static OffConfig = new LoggingConfig(false);
  private static _current: LoggingConfig;
}

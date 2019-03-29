export class LoggingConfig
{
  constructor (
    public logging: boolean
  ) { }
}

export const DefaultLoggingConfig = new LoggingConfig(true);

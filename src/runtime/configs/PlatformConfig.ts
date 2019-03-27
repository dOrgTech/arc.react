export class PlatformConfig
{
  constructor (
    public logging: boolean
  ) { }
}

export const DefaultPlatformConfig = new PlatformConfig(true);

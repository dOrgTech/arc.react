// TODO: move these properties into the extension (DAO) level
export abstract class ProtocolConfig
{
  // TODO: subscribers to support rerenders when
  // values change at runtime

  constructor(
    public web3HttpUrl: string,
    public graphqlHttpUrl: string,
    public graphqlWsUrl: string
  ) { }
}

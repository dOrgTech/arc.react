export abstract class ProtocolConfig<Connection> {
  public abstract connection: Connection;
  public abstract isInitialized: boolean;
  public abstract async initialize(): Promise<boolean>;
}

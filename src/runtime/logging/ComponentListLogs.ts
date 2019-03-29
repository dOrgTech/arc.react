import {
  ReactLogs,
  EntityLogs,
  DataLogs
} from "./types";
import { LoggingConfig } from "../configs/LoggingConfig";

// The goal of this class is to:
// 1. preserve memory through lazy allocation
// 2. ensure high data integrity by guarding
//    log data at the language level.
export class ComponentListLogs {
  public get react(): ReactLogs | undefined {
    return this._react;
  }

  public get entity(): EntityLogs | undefined {
    return this._entity;
  }

  public get data(): DataLogs | undefined {
    return this._data;
  }

  public get getReact(): ReactLogs {
    if (!this._react) this._react = new ReactLogs();
    return this._react;
  }

  public get getEntity(): EntityLogs {
    if (!this._entity) this._entity = new EntityLogs();
    return this._entity;
  }

  public get getData(): DataLogs {
    if (!this._data) this._data = new DataLogs();
    return this._data;
  }

  private _react?: ReactLogs;
  private _entity?: EntityLogs;
  private _data?: DataLogs;

  public reactRendered(config: LoggingConfig) {
    if (!config.logging) return;
    this.getReact.rendered();
  }

  public entityCreated(config: LoggingConfig) {
    if (!config.logging) return;
    this.getEntity.created();
  }

  public entityCreationFailed(config: LoggingConfig, error: Error) {
    if (!config.logging) return;
    this.getEntity.creationFailed(error);
  }

  public dataQueryStarted(config: LoggingConfig) {
    if (!config.logging) return;
    this.getData.queryStarted();
  }

  public dataQueryReceivedData(config: LoggingConfig) {
    if (!config.logging) return;
    this.getData.queryReceivedData();
  }

  public dataQueryCompleted(config: LoggingConfig) {
    if (!config.logging) return;
    this.getData.queryCompleted();
  }

  public dataQueryFailed(config: LoggingConfig, error: Error) {
    if (!config.logging) return;
    this.getData.queryFailed(error);
  }
}

import {
  ReactLogs,
  EntityLogs,
  DataLogs,
  CodeLogs,
  ProseLogs
} from "./types";
import { ComponentConfig } from "../config/ComponentConfig";

// The goal of this class is to:
// 1. preserve memory through lazy allocation
// 2. ensure high data integrity by guarding
//    log data at the language level.
export class ComponentLogs {

  public get react(): ReactLogs | undefined {
    return this._react;
  }

  public get entity(): EntityLogs | undefined {
    return this._entity;
  }

  public get data(): DataLogs | undefined {
    return this._data;
  }

  public get code(): CodeLogs | undefined {
    return this._code;
  }

  public get prose(): ProseLogs | undefined {
    return this._prose;
  }

  private get getReact(): ReactLogs {
    if (!this._react) this._react = new ReactLogs();
    return this._react;
  }

  private get getEntity(): EntityLogs {
    if (!this._entity) this._entity = new EntityLogs();
    return this._entity;
  }

  private get getData(): DataLogs {
    if (!this._data) this._data = new DataLogs();
    return this._data;
  }

  private get getCode(): CodeLogs {
    if (!this._code) this._code = new CodeLogs();
    return this._code;
  }

  private get getProse(): ProseLogs {
    if (!this._prose) this._prose = new ProseLogs();
    return this._prose;
  }

  private _react?: ReactLogs;
  private _entity?: EntityLogs;
  private _data?: DataLogs;
  private _code?: CodeLogs;
  private _prose?: ProseLogs;

  public reactRendered(config: ComponentConfig) {
    if (!config.logging) return;
    this.getReact.rendered();
  }

  public entityCreated(config: ComponentConfig) {
    if (!config.logging) return;
    this.getEntity.created();
  }

  public entityCreationFailed(config: ComponentConfig, error: Error) {
    if (!config.logging) return;
    this.getEntity.creationFailed(error);
  }

  public dataQueryStarted(config: ComponentConfig) {
    if (!config.logging) return;
    this.getData.queryStarted();
  }

  public dataQueryReceivedData(config: ComponentConfig) {
    if (!config.logging) return;
    this.getData.queryReceivedData();
  }

  public dataQueryCompleted(config: ComponentConfig) {
    if (!config.logging) return;
    this.getData.queryCompleted();
  }

  public dataQueryFailed(config: ComponentConfig, error: Error) {
    if (!config.logging) return;
    this.getData.queryFailed(error);
  }

  public codeCreationFailed(config: ComponentConfig, error: Error) {
    if (!config.logging) return;
    this.getCode.creationFailed(error);
  }

  public proseCreationFailed(config: ComponentConfig, error: Error) {
    if (!config.logging) return;
    this.getProse.creationFailed(error);
  }
}

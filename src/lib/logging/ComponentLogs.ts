import {
  ReactLogs,
  EntityLogs,
  DataLogs,
  CodeLogs,
  ProseLogs
} from "./logs";
import LoggingConfig from "./index";

// TODO: redo the logging code w/ mixins to eliminate the code depulication...

// The goal of this class is to delay creation of the logs
// to help with memory effeciency. Don't take up room if
// nothing is being logged or if logging is disabled.
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

  public reactRendered() {
    if (!LoggingConfig.enabled) return;
    this.getReact.rendered();
  }

  public entityCreated() {
    if (!LoggingConfig.enabled) return;
    this.getEntity.created();
  }

  public entityCreationFailed(error: Error) {
    if (!LoggingConfig.enabled) return;
    this.getEntity.creationFailed(error);
  }

  public dataQueryStarted() {
    if (!LoggingConfig.enabled) return;
    this.getData.queryStarted();
  }

  public dataQueryReceivedData() {
    if (!LoggingConfig.enabled) return;
    this.getData.queryReceivedData();
  }

  public dataQueryCompleted() {
    if (!LoggingConfig.enabled) return;
    this.getData.queryCompleted();
  }

  public dataQueryFailed(error: Error) {
    if (!LoggingConfig.enabled) return;
    this.getData.queryFailed(error);
  }

  public codeCreationFailed(error: Error) {
    if (!LoggingConfig.enabled) return;
    this.getCode.creationFailed(error);
  }

  public proseCreationFailed(error: Error) {
    if (!LoggingConfig.enabled) return;
    this.getProse.creationFailed(error);
  }
}

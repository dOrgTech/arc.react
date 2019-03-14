// global logging flag
// logging functions (use flag)

export interface EntityLogs {
  createTime: number;
  createCount: number;
  error?: Error;
}

export interface DataLogs {
  createTime: number;
  queryCount: number;
  dataReceived: boolean;
  queryComplete: boolean;
  error?: Error;
}

export interface CodeLogs {
  // TODO: wrong addresses, incompatible contracts, etc
  error?: Error;
}

export interface ProseLogs {
  // TODO: fill out
  error?: Error;
}

export class ComponentLogs {
  public static enabled: boolean = true;

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

  private _entity?: EntityLogs;
  private _data?: DataLogs;
  private _code?: CodeLogs;
  private _prose?: ProseLogs;

  public entityCreation() {
    const logs = this.entityLogs();

    if (logs) {
      logs.createTime = Date.now();
      logs.createCount = ++logs.createCount;
      logs.error = undefined;
    }
  }

  public entityCreationError(error: Error) {
    const logs = this.entityLogs();

    if (logs) {
      logs.error = error;
    }
  }

  public dataQueryStart() {
    const logs = this.dataLogs();

    if (logs) {
      logs.createTime = Date.now();
      logs.queryCount = ++logs.queryCount;
      logs.dataReceived = false;
      logs.queryComplete = false;
      logs.error = undefined;
    }
  }

  public dataQueryError(error: Error) {
    const logs = this.dataLogs();

    if (logs) {
      logs.error = error;
    }
  }

  public dataQueryComplete() {
    const logs = this.dataLogs();

    if (logs) {
      logs.queryComplete = true;
    }
  }

  public dataReceived() {
    const logs = this.dataLogs();

    if (logs) {
      logs.dataReceived = true;
    }
  }

  private entityLogs(): EntityLogs | undefined {
    if (!ComponentLogs.enabled) {
      this._entity = undefined;
    } else if (!this._entity) {
      this._entity = {
        createTime: -1,
        createCount: 0
      };
    }

    return this._entity;
  }

  private dataLogs(): DataLogs | undefined {
    if (!ComponentLogs.enabled) {
      this._data = undefined;
    } else if (!this._data) {
      this._data = {
        createTime: -1,
        queryCount: 0,
        dataReceived: false,
        queryComplete: false,
      };
    }

    return this._data;
  }
}

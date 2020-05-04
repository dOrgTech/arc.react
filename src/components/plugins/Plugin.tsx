import {
  IPluginState as EntityData,
  IProposalState as ProposalData,
  IProposalBaseCreateOptions as ProposalOptions,
  AnyPlugin,
  ProposalPlugin as ProposableEntity,
} from "@dorgtech/arc.js";
import { Observable } from "rxjs";

export interface IPlugin<TPluginEntity extends AnyPlugin> {
  state(): Observable<EntityData>;
  fetchState(): Promise<EntityData>;
}

type InferPlugin<TPlugin> = TPlugin extends IPlugin<infer TPluginEntity>
  ? TPluginEntity
  : undefined;

class Plugin<
  // We are ignoring this because of:
  // https://github.com/microsoft/TypeScript/issues/34933
  //@ts-ignore
  ImplementedPlugin extends IPlugin<InferPlugin<ImplementedPlugin>>
> {
  constructor(public plugin: ImplementedPlugin) {}

  getState(): Observable<EntityData> {
    return this.plugin.state();
  }

  fetchState(): Promise<EntityData> {
    return this.plugin.fetchState();
  }
}

export class ProposalPlugin extends Plugin<InferPlugin<AnyPlugin>> {
  constructor(
    public entity: ProposableEntity<EntityData, ProposalData, ProposalOptions>
  ) {
    super(entity);
  }
}

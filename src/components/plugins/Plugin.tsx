// import * as React from "react";
// import { PluginName, IPluginState as EntityData, Plugin as Entity, AnyPlugin, SchemeRegistrar } from "@dorgtech/arc.js";
// import { Observable } from "rxjs";
// import { CreateContextFeed } from "../../runtime/ContextFeed";
// import { Arc as Protocol, ArcConfig as ProtocolConfig, Component, ComponentLogs } from "../../";

// // I should not define this interface and consume it from the arc.js
// export interface IPlugin<TPluginEntity extends AnyPlugin> {
//   state(): Observable<EntityData>;
//   fetchState(): Promise<EntityData>;
// }

// type InferPlugin<TPlugin> = TPlugin extends IPlugin<infer TPluginEntity> ? TPluginEntity : undefined;

// export class PluginConnector<
//   // We are ignoring this because of:
//   // https://github.com/microsoft/TypeScript/issues/34933
//   //@ts-ignore
//   ImplementedPlugin extends IPlugin<InferPlugin<ImplementedPlugin>>
// > {
//   constructor(public plugin: ImplementedPlugin) {}

//   getState(): Observable<EntityData> {
//     return this.plugin.state();
//   }

//   fetchState(): Promise<EntityData> {
//     return this.plugin.fetchState();
//   }
// }

// interface RequiredProps {
//   // Plugin ID
//   id: string;
// }

// interface InferredProps extends RequiredProps {
//   config: ProtocolConfig;
//   noSub?: boolean;
// }

// class InferredPlugin extends Component<InferredProps, AnyPlugin, EntityData> {
//   protected createEntity(): AnyPlugin {
//     const { config, id } = this.props;

//     if (!config) {
//       throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
//     }

//     return new SchemeRegistrar(config.connection, id);
//   }

//   public static get Entity() {
//     return CreateContextFeed(this._EntityContext.Consumer, this._LogsContext.Consumer, "Plugin");
//   }

//   public static get Data() {
//     return CreateContextFeed(this._DataContext.Consumer, this._LogsContext.Consumer, "Plugin");
//   }

//   public static get Logs() {
//     return CreateContextFeed(this._LogsContext.Consumer, this._LogsContext.Consumer, "Plugin");
//   }

//   protected static _EntityContext = React.createContext<AnyPlugin | undefined>(undefined);
//   protected static _DataContext = React.createContext<EntityData | undefined>(undefined);
//   protected static _LogsContext = React.createContext<ComponentLogs | undefined>(undefined);
// }

// class Plugin extends React.Component<RequiredProps> {
//   public render() {
//     const { id, children } = this.props;

//     return (
//       <Protocol.Config>
//         {(config: ProtocolConfig) => (
//           <InferredPlugin id={id} config={config}>
//             {children}
//           </InferredPlugin>
//         )}
//       </Protocol.Config>
//     );
//   }

//   public static get Entity() {
//     return InferredPlugin.Entity;
//   }

//   public static get Data() {
//     return InferredPlugin.Data;
//   }

//   public static get Logs() {
//     return InferredPlugin.Logs;
//   }
// }

// export default Plugin;

// export { Plugin, InferredPlugin, PluginName as PluginEntity, EntityData as PluginData };

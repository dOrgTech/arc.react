// import * as React from "react";
// import { Component, ComponentLogs } from "../../runtime";
// import { Arc, ArcConfig, DevArcConfig } from "../../protocol";
// import { SchemeRegistrar as EntityType, ISchemeRegistrarState as Data } from "@dorgtech/arc.js";
// import { IPlugin, ProposalPlugin } from "./Plugin";
// import { Observable } from "rxjs";
// interface RequiredProps {
//   // Address of the DAO Avatar
//   address: string;
//   noSub?: boolean
// }

// interface InferredProps {
//   // Arc Instance
//   arcConfig: ArcConfig | undefined;
// }

// type Props = RequiredProps & InferredProps;

// class PluginManager implements IPlugin<EntityType> {
//   constructor(public plugin: EntityType) {}

//   state(): Observable<Data> {
//     return this.plugin.state();
//   }

//   fetchState(): Promise<Data> {
//     return this.plugin.fetchState();
//   }

// }

// class ArcPluginManager extends Component<Props, EntityType, Data> {
//   protected createEntity(): EntityType {
//     const { arcConfig, address } = this.props;
//     if (!arcConfig) {
//       throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
//     }
//     const pluginManager = new EntityType(arcConfig.connection, address);
//     const implementation = new PluginManager(pluginManager);
//     const p = new Plugin()
//     // return p.plugin;
//   }

//   protected async initialize(entity: EntityType | undefined): Promise<void> {
//     const { noSub } = this.props;
//     if (entity) {
//       // const implementation = new PluginManager(entity);
//       // const test = await implementation.fetchState();
//       // implementation.plugin.coreState
//     }

//     return Promise.resolve();
//   }
// }

// // class PluginManager extends React.Component<Props> {
// //   public render() {
// //     const { address, children } = this.props;

// //     return (
// //       <Arc.Config>
// //         {(arc: ArcConfig) => (
// //           <ArcDAO address={address} arcConfig={arc}>
// //             {children}
// //           </ArcDAO>
// //         )}
// //       </Arc.Config>
// //     );
// //   }

// //   public static get Entity() {
// //     return ArcDAO.Entity;
// //   }

// //   public static get Data() {
// //     return ArcDAO.Data;
// //   }

// //   public static get Logs() {
// //     return ArcDAO.Logs;
// // }
// // }

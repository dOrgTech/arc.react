// import * as React from "react";
// import { Proposal as Entity, IProposalState as Data } from "@dorgtech/arc.js";
// import {
//   Arc as Protocol,
//   ArcConfig as ProtocolConfig,
//   Component,
//   ComponentLogs,
// } fro../..../";
// import { CreateContextFeed } fro../../runtime/ContextFeedeed";

// interface RequiredProps {
//   // Proposal ID
//   id: string;
// }

// interface InferredProps extends RequiredProps {
//   config: ProtocolConfig;
// }

// class InferredProposal extends Component<InferredProps, Entity, Data> {
//   protected async createEntity(): Promise<Entity> {
//     const { config, id } = this.props;

//     if (!config) {
//       throw Error(
//         "Arc Config Missing: Please provide this field as a prop, or use the inference component."
//       );
//     }

//     return new Entity(id, config.connection);
//   }

//   protected async initialize(entity: Entity): Promise<void> {
//     // TODO: remove this when this issue is resolved: https://github.com/daostack/client/issues/291
//     entity.staticState = undefined;
//     await entity.fetchStaticState();
//   }

//   public static get Entity() {
//     return CreateContextFeed(
//       this._EntityContext.Consumer,
//       this._LogsContext.Consumer,
//       "Proposal"
//     );
//   }

//   public static get Data() {
//     return CreateContextFeed(
//       this._DataContext.Consumer,
//       this._LogsContext.Consumer,
//       "Proposal"
//     );
//   }

//   public static get Logs() {
//     return CreateContextFeed(
//       this._LogsContext.Consumer,
//       this._LogsContext.Consumer,
//       "Proposal"
//     );
//   }

//   protected static _EntityContext = React.createContext<Entity | undefined>(
//     undefined
//   );
//   protected static _DataContext = React.createContext<Data | undefined>(
//     undefined
//   );
//   protected static _LogsContext = React.createContext<
//     ComponentLogs | undefined
//   >(undefined);
// }

// class Proposal extends React.Component<RequiredProps> {
//   public render() {
//     const { id, children } = this.props;

//     return (
//       <Protocol.Config>
//         {(config: ProtocolConfig) => (
//           <InferredProposal id={id} config={config}>
//             {children}
//           </InferredProposal>
//         )}
//       </Protocol.Config>
//     );
//   }

//   public static get Entity() {
//     return InferredProposal.Entity;
//   }

//   public static get Data() {
//     return InferredProposal.Data;
//   }

//   public static get Logs() {
//     return InferredProposal.Logs;
//   }
// }

// export default Proposal;

// export {
//   InferredProposal,
//   Proposal,
//   Entity as ProposalEntity,
//   Data as ProposalData,
// };

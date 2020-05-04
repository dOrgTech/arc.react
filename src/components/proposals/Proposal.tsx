// import * as React from "react";
// import { Component, ComponentLogs } from "../../runtime";
// import { CreateContextFeed } from "../../runtime/ContextFeed";
// import { Arc as Protocol, ArcConfig as ProtocolConfig } from "../../protocol";
// import { Proposal as Entity, IProposalState as Data } from "@dorgtech/arc.js";

// interface RequiredProps {
//   // Proposal ID
//   id: string;
// }

// interface InferredProps {
//   // Arc Instance
//   arcConfig: ProtocolConfig | undefined;
// }

// type Props = RequiredProps & InferredProps;

// class ArcProposal extends Component<Props, Entity, Data> {
//   protected createEntity(): Entity {
//     const { arcConfig, id } = this.props;

//     if (!arcConfig) {
//       throw Error(
//         "Arc Config Missing: Please provide this field as a prop, or use the inference component."
//       );
//     }

//     return new Entity(arcConfig.connection, id);
//   }

//   protected async initialize(entity: Entity | undefined): Promise<void> {
//     if (entity) {
//       await entity.fetchState();
//     }

//     return Promise.resolve();
//   }

//   public static get Entity() {
//     return CreateContextFeed(
//       this._EntityContext.Consumer,
//       this._LogsContext.Consumer
//     );
//   }

//   public static get Data() {
//     return CreateContextFeed(
//       this._DataContext.Consumer,
//       this._LogsContext.Consumer
//     );
//   }

//   public static get Logs() {
//     return CreateContextFeed(
//       this._LogsContext.Consumer,
//       this._LogsContext.Consumer
//     );
//   }

//   protected static _EntityContext = React.createContext({});
//   protected static _DataContext = React.createContext({});
//   protected static _LogsContext = React.createContext({});
// }

// class Proposal extends React.Component<RequiredProps> {
//   public render() {
//     const { id, children } = this.props;

//     return (
//       <Protocol.Config>
//         {(arc: ProtocolConfig) => (
//           <ArcProposal id={id} arcConfig={arc}>
//             {children}
//           </ArcProposal>
//         )}
//       </Protocol.Config>
//     );
//   }

//   public static get Entity() {
//     return ArcProposal.Entity;
//   }

//   public static get Data() {
//     return ArcProposal.Data;
//   }

//   public static get Logs() {
//     return ArcProposal.Logs;
//   }
// }

// export default Proposal;

// export {
//   ArcProposal,
//   Proposal,
//   Props as ProposalProps,
//   Entity as ProposalEntity,
//   Data as ProposalData,
//   ComponentLogs,
// };

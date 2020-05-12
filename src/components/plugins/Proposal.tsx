import * as React from "react";
import { first } from "rxjs/operators";
import {
  Proposal as BaseEntity,
  IProposalState as BaseData,
} from "@dorgtech/arc.js";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig,
  Component,
  ComponentProps,
  ComponentLogs,
} from "../../";
import { CreateContextFeed } from "../../runtime/ContextFeed";

abstract class Entity extends BaseEntity<BaseData> {}
type Data = BaseData;

interface RequiredProps extends ComponentProps<Entity, Data> {
  // Proposal ID
  id: Entity | string;
}

interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

class InferredProposal extends Component<InferredProps, Entity, Data> {
  protected async createEntity(): Promise<Entity> {
    const { config, id } = this.props;

    if (!config) {
      throw Error(
        "Arc Config Missing: Please provide this field as a prop, or use the inference component."
      );
    }

    if (!id) {
      throw Error(
        "ID Missing: Please provide this field as a prop, or use the inference component"
      );
    }

    if (typeof id === "string") {
      const proposal = await Entity.search(config.connection, { where: { id } })
        .pipe(first())
        .toPromise();

      if (!proposal || proposal.length === 0) {
        throw Error("Proposal not found");
      }

      return proposal[0];
    } else {
      return id;
    }
  }

  public static get Entity() {
    return CreateContextFeed(
      this._EntityContext.Consumer,
      this._LogsContext.Consumer,
      "Proposal"
    );
  }

  public static get Data() {
    return CreateContextFeed(
      this._DataContext.Consumer,
      this._LogsContext.Consumer,
      "Proposal"
    );
  }

  public static get Logs() {
    return CreateContextFeed(
      this._LogsContext.Consumer,
      this._LogsContext.Consumer,
      "Proposal"
    );
  }

  protected static _EntityContext = React.createContext<Entity | undefined>(
    undefined
  );
  protected static _DataContext = React.createContext<Data | undefined>(
    undefined
  );
  protected static _LogsContext = React.createContext<
    ComponentLogs | undefined
  >(undefined);
}

class Proposal extends React.Component<RequiredProps> {
  public render() {
    const { id, children } = this.props;
    return (
      <Protocol.Config>
        {(config: ProtocolConfig) => (
          <InferredProposal id={id} config={config}>
            {children}
          </InferredProposal>
        )}
      </Protocol.Config>
    );
  }

  public static get Entity() {
    return InferredProposal.Entity;
  }

  public static get Data() {
    return InferredProposal.Data;
  }

  public static get Logs() {
    return InferredProposal.Logs;
  }
}

export default Proposal;

export {
  Proposal,
  InferredProposal,
  Entity as ProposalEntity,
  Data as ProposalData,
};

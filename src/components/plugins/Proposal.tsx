import {
  Proposal as BaseEntity,
  IProposalState as BaseData,
} from "@dorgtech/arc.js";
import { ArcConfig as ProtocolConfig, Component, ComponentProps } from "../../";
import { CreateContextFeed } from "../../runtime/ContextFeed";

export interface RequiredProps extends ComponentProps {
  // Proposal ID
  id: string;
}

export interface InferredProps extends RequiredProps {
  config: ProtocolConfig;
}

export abstract class Proposal<
  Entity extends BaseEntity<Data>,
  Data extends BaseData
> extends Component<InferredProps, Entity, Data> {
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
}

export { BaseEntity as ProposalEntity, BaseData as ProposalData };

// TODO: @cesar make sure this works
/*
<ContributionRewardProposal id="0x77777">

  <PluginManagerProposal id="0x2134234234234">
    <ContributionRewardProposal.Data>
    <Proposal.Data>
    {(genericData: ProposalData, contributionRewardData: ContributionRewardProposalData) => {
      genericData.id === "0x2134234234234"
      contributionRewardData.id === "0x77777"
    }}
    </Proposal.Data>
    </ContributionRewardProposal.Data>
  </PluginManagerProposal>

  <Proposal.Data>
    {(genericData: ProposalData) => {
      genericData.id === "0x77777"
    }}
  </Proposal.Data>
</ContributionRewardProposal>
*/

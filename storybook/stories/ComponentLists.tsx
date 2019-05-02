import * as React from "react";
import { storiesOf } from "@storybook/react";
import {
  Arc,
  DefaultArcConfig,
  DAOs,
  DAO,
  DAOData,
  DAOEntity,
  Members,
  Member,
  MemberData,
  Proposal,
  Proposals,
  ProposalData,
  Reputations,
  Reputation,
  ReputationData
} from "../../src/";

// TODO: create ComponentListView similar to ComponentView
export default () =>
  storiesOf("Component Lists", module)
    .add("DAOs", () => {
      return (
        <Arc config={DefaultArcConfig}>
          <DAOs>
            <div>something useful</div>
            <DAO.Data>
            {(data: DAOData | undefined) => (
              data ?
                <>
                <div>{data.name}</div>
                <div>{data.address}</div>
                <div>{data.memberCount}</div>
                </>
              : <div>loading...</div>
            )}
            </DAO.Data>
            <Members>
              <Member.Data>
              {(data: MemberData | undefined) => (
                data ?
                <>
                <div>{data.address}</div>
                <div>{data.tokens.toString()}</div>
                <div>{data.reputation.toString()}</div>
                </>
                : <div>loading...</div>
              )}
              </Member.Data>
            </Members>
          </DAOs>
        </Arc>
      )
    })
    .add("DAO Entities", () => {
      return (
        <Arc config={DefaultArcConfig}>
          <DAOs>
            {(entities: DAOEntity[]) => (
              entities ?
              <>
                {entities.map((entity, index) => (
                  <React.Fragment key={index}>
                  <div>{entity.address}</div>
                  </React.Fragment>
                ))}
              </>
              : <div>loading...</div>
            )}
          </DAOs>
        </Arc>
      )
    })
    .add("Proposals", () => {
      return (
        <Arc config={DefaultArcConfig}>
          <DAO address={"0xe7a2c59e134ee81d4035ae6db2254f79308e334f"}>
            <Proposals>
              <Proposal.Data>
              {(data: ProposalData) => (
                <div>{data.id}</div>
              )}
              </Proposal.Data>
            </Proposals>
          </DAO>
        </Arc>
      )
    })
    .add("Reputations", () => {
      return (
        <Arc config={DefaultArcConfig}>
          <Reputations>
            <Reputation.Data>
            {(data: ReputationData) => (
              <>
              <div>{data.address}</div>
              <div>{data.totalSupply.toString()}</div>
              </>
            )}
            </Reputation.Data>
          </Reputations>
        </Arc>
      )
    });

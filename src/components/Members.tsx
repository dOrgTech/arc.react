import * as React from "react";
import { Observable } from "rxjs";
import {
  CProps,
  ComponentList,
  ComponentListProps
} from "../runtime";
import {
  Arc as Protocol,
  ArcConfig as ProtocolConfig
} from "../protocol";
import {
  DAO as InferComponent,
  DAOEntity as InferEntity,
  DAOMember as Component,
  MemberEntity as Entity,
  MemberData as Data
} from "./";

interface RequiredProps extends ComponentListProps<Entity, Data> {
  allDAOs?: boolean;
}

interface ArcInferredProps {
  arcConfig: ProtocolConfig | undefined;
}

interface DAOInferredProps {
  dao: InferEntity | undefined;
}

type ArcProps = RequiredProps & ArcInferredProps;
type DAOProps = RequiredProps & DAOInferredProps;

class ArcMembers extends ComponentList<ArcProps, Component>
{
  createObservableEntities(): Observable<Entity[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return Entity.search(arcConfig.connection);
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    return (
      <Component address={entity.address} dao={new InferEntity(entity.daoAddress, entity.context)}>
      {children}
      </Component>
    )
  }
}

class DAOMembers extends ComponentList<DAOProps, Component>
{
  // TODO: remove this when filters are added
  // also rename all instances of "Arc" to protocol?
  createObservableEntities(): Observable<Entity[]> {
    const { dao } = this.props;
    if (!dao) {
      throw Error("DAO Entity Missing: Please provide this field as a prop, or use the inference component.");
    }
    return Entity.search(dao.context, { dao: dao.address });
  }

  renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Component>, any> {
    const { dao } = this.props;
    return (
      <Component address={entity.address} dao={dao}>
      {children}
      </Component>
    );
  }
}

class Members extends React.Component<RequiredProps>
{
  render() {
    const { children, allDAOs } = this.props;

    if (allDAOs) {
      return (
        <Protocol.Config>
        {(arcConfig: ProtocolConfig) => (
          <ArcMembers arcConfig={arcConfig}>
          {children}
          </ArcMembers>
        )}
        </Protocol.Config>
      );
    } else {
      return (
        <InferComponent.Entity>
        {(dao: InferEntity) => (
          <DAOMembers dao={dao}>
          {children}
          </DAOMembers>
        )}
        </InferComponent.Entity>
      );
    }
  }
}

export default Members;

export {
  ArcMembers,
  DAOMembers,
  Members
};

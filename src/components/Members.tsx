import * as React from "react";
import { Observable } from "rxjs";
import {
  CProps,
  ComponentList,
  BaseProps
} from "../runtime";
import {
  Arc,
  ArcConfig
} from "../protocol";
import {
  DAO,
  DAOEntity,
  DAOMember,
  MemberEntity
} from "./";

interface RequiredProps extends BaseProps {
  allDAOs?: boolean;
}

interface ArcInferredProps {
  arcConfig: ArcConfig | undefined;
}

interface DAOInferredProps {
  dao: DAOEntity | undefined;
}

type ArcProps = RequiredProps & ArcInferredProps;
type DAOProps = RequiredProps & DAOInferredProps;

class ArcMembers extends ComponentList<ArcProps, DAOMember>
{
  createObservableEntities(): Observable<MemberEntity[]> {
    const { arcConfig } = this.props;
    if (!arcConfig) {
      throw Error("Arc Config Missing: Please provide this field as a prop, or use the inference component.");
    }
    return MemberEntity.search({}, arcConfig.connection);
  }

  renderComponent(entity: MemberEntity, children: any): React.ComponentElement<CProps<DAOMember>, any> {
    return (
      <DAOMember address={entity.address} dao={new DAOEntity(entity.daoAddress, entity.context)}>
      {children}
      </DAOMember>
    )
  }
}

class DAOMembers extends ComponentList<DAOProps, DAOMember>
{
  createObservableEntities(): Observable<MemberEntity[]> {
    const { dao } = this.props;
    if (!dao) {
      throw Error("DAO Entity Missing: Please provide this field as a prop, or use the inference component.");
    }
    return dao.members({});
  }

  renderComponent(entity: MemberEntity, children: any): React.ComponentElement<CProps<DAOMember>, any> {
    const { dao } = this.props;
    return (
      <DAOMember address={entity.address} dao={dao}>
      {children}
      </DAOMember>
    );
  }
}

class Members extends React.Component<RequiredProps>
{
  render() {
    const { children, allDAOs } = this.props;

    if (allDAOs) {
      return (
        <Arc.Config>
        {(arc: ArcConfig) => (
          <ArcMembers arcConfig={arc}>
          {children}
          </ArcMembers>
        )}
        </Arc.Config>
      );
    } else {
      return (
        <DAO.Entity>
        {(dao: DAOEntity) => (
          <DAOMembers dao={dao}>
          {children}
          </DAOMembers>
        )}
        </DAO.Entity>
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

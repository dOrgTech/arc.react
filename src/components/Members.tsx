import * as React from "react";
import { Observable } from "rxjs";
import {
  CEntity,
  CProps,
  ComponentList,
  BaseProps,
  Logging
} from "../runtime";
import {
  DAO,
  DAOEntity,
  DAOMember
} from "./";

interface RequiredProps { }

interface InferredProps {
  dao?: DAOEntity;
}

type Props = RequiredProps & InferredProps & BaseProps;

class DAOMembers extends ComponentList<Props, DAOMember>
{
  createObservableEntities(): Observable<CEntity<DAOMember>[]> {
    const { dao } = this.props;
    // TODO: better error handling?
    if (!dao) {
      throw Error("DAO Entity Missing: Please provide this field as a props, or use the inference component.");
    }
    return dao.members();
  }

  renderComponent(entity: CEntity<DAOMember>, children: any): React.ComponentElement<CProps<DAOMember>, any> {
    const { dao, loggingConfig } = this.props;
    return (
      <DAOMember address={entity.address} dao={dao} loggingConfig={loggingConfig}>
        {children}
      </DAOMember>
    )
  }
}

class Members extends React.Component<RequiredProps>
{
  render() {
    const { children } = this.props;

    return (
      <Logging.Config>
      {logging =>
        <DAO.Entity>
        {dao =>
          <DAOMembers dao={dao} loggingConfig={logging}>
          {children}
          </DAOMembers>
        }
        </DAO.Entity>
      }
      </Logging.Config>
    );
  }
}

export default Members;

export {
  DAOMembers,
  Members
};

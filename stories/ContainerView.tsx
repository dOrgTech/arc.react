import * as React from "react";
import * as ObjectInspector from "react-object-inspector";

interface Props {
  name: string,
  Container: React.ComponentClass<any, any> | React.FunctionComponent<any>,
  Context: React.Context<any>,
  props: any
}

const ContainerView: React.SFC<Props> = ({ name, Container, Context, props }) => (
  <Container {...props}>
    <Context.Consumer>
      {data => (
        <ObjectInspector data={data} name={name} />
      )}
    </Context.Consumer>
  </Container>
)

export default ContainerView;

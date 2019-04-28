import * as React from "react";

// TODO: remove this dep from the package, and instead have the user
//       of the library provide their own loading component
const Spinner = require("react-spinkit");

type ConsumerComponent = React.ExoticComponent<React.ConsumerProps<any>>

export interface Props extends React.PropsWithChildren<{}> {
  _consumers?: ConsumerComponent[]
}

class ContextFeed extends React.Component<Props>
{
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { children, _consumers } = this.props;

    if (!_consumers) {
      throw Error("Error: ContextFeed missing context consumer(s).");
    }

    if (!children) {
       throw Error("Error: A ContextFeed requires a child component.");
    }

    if (typeof children === "function") {
      // TODO: make sure it's a function w/ the correct argument types
      // var args: ArgumentTypes<typeof children> = ["foo", "foo"];

      const length = _consumers.length;
      const RelayValues = (index: number, values: Array<any> = []) => {
        if (index < length) {
          const Consumer = _consumers[index];
          return (
            <Consumer>
            {(value) => (
              RelayValues(index + 1, [...values, value])
            )}
            </Consumer>
          )
        } else {
          if (values.indexOf(undefined) > -1) {
            return <Spinner name='double-bounce' />
          } else {
            return children(...values);
          }
        }
      };

      return RelayValues(0);
    }

    // In this case, the child or children are components,
    // so we'll inject them with our _consumers
    if (children["length"]) {
      const childrenArray = children as Array<any>;
      const newChildren = new Array();

      for (const child of childrenArray) {
        newChildren.push(React.cloneElement(child, {
          _consumers
        }));
      }

      return (<>{newChildren}</>);
    } else {
      return React.cloneElement(children as React.ReactElement, {
        _consumers
      });
    }
  }
}

export const CreateContextFeed = (consumer: ConsumerComponent) => (
  (props: Props) => (
    <ContextFeed _consumers={
      props._consumers ?
      [...props._consumers, consumer] :
      [consumer]
    } children={props.children} />
  )
);

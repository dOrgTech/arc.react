import * as React from "react";
import LoadingView from "./LoadingView";
import { ComponentLogs, ComponentListLogs, ProtocolLogs } from "./";

type ConsumerComponent = React.ExoticComponent<React.ConsumerProps<any>>;

export interface Props extends React.PropsWithChildren<{}> {
  _consumers?: ConsumerComponent[];
  _logs?: (ConsumerComponent | undefined)[];
}

class ContextFeed extends React.Component<Props> {
  constructor(props: Props) {
    console.log(props);
    super(props);
  }

  public render() {
    const { children, _consumers, _logs } = this.props;

    if (!_consumers || !_logs) {
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
          // If we are still iterating through _consumers
          const Consumer = _consumers[index];

          // render the context consumers, and pass the
          // value to this function recursively
          return (
            <Consumer>
              {(value) => RelayValues(index + 1, [...values, value])}
            </Consumer>
          );
        } else {
          // We've recursed through all consumers. Now let's
          // check for undefined values and give logging information
          // for why they're undefined.
          const nullIndex = values.indexOf(undefined);

          // If we have a value that is still undefined
          if (nullIndex > -1) {
            // Get its logs and pass them to the LoadingView component
            const Logs = _logs[nullIndex];

            // TODO: This is required because Protocol's don't have logs. Need to add this, or just make Protocol's components...
            if (Logs === undefined) {
              return <div>Loading...</div>;
            }

            return (
              <Logs>
                {(logs: ComponentLogs | ComponentListLogs | ProtocolLogs) => (
                  <LoadingView logs={logs} />
                )}
              </Logs>
            );
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
        newChildren.push(
          React.cloneElement(child, {
            _consumers,
            _logs,
          })
        );
      }

      return <>{newChildren}</>;
    } else {
      return React.cloneElement(children as React.ReactElement, {
        _consumers,
        _logs,
      });
    }
  }
}

export const CreateContextFeed = (
  consumer: ConsumerComponent,
  logs: ConsumerComponent | undefined
) => (props: Props) => (
  <ContextFeed
    _consumers={props._consumers ? [...props._consumers, consumer] : [consumer]}
    _logs={props._logs ? [...props._logs, logs] : [logs]}
    children={props.children}
  />
);

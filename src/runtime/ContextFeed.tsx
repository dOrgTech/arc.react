import * as React from "react";
import LoadingView from "./LoadingView";
import { ComponentLogs, ComponentListLogs, ProtocolLogs } from "./";

type ConsumerComponent = React.ExoticComponent<React.ConsumerProps<any>>;

export interface Props extends React.PropsWithChildren<{}> {
  _consumers?: ConsumerComponent[];
  _logs?: ConsumerComponent[];
  _entity?: string;
  noLoad?: boolean;
}

class ContextFeed extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { children, _consumers, _logs, _entity, noLoad } = this.props;
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
          // AND we want to handle loading in this component
          if (nullIndex > -1 && !noLoad) {
            // Get its logs and pass them to the LoadingView component
            const Logs = _logs[nullIndex];
            return (
              <Logs>
                {(logs: ComponentLogs | ComponentListLogs | ProtocolLogs) => (
                  <LoadingView entity={_entity} logs={logs} />
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
      const newChildren = [];

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
  logs: ConsumerComponent,
  entity?: string
) => (props: Props) => (
  <ContextFeed
    _consumers={props._consumers ? [...props._consumers, consumer] : [consumer]}
    _logs={props._logs ? [...props._logs, logs] : [logs]}
    _entity={entity}
  >
    {props.children}
  </ContextFeed>
);

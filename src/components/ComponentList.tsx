import * as React from "react";
import memoize from "memoize-one";
import { Observable, Subscription } from "rxjs";
import * as R from "ramda";

import Arc from "@daostack/client";
import arc from "../lib/arc";

import { Component } from "./Component";

// Extract the DAO's template parameters
export type CProps<Comp>  = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Props : undefined;
export type CEntity<Comp> = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Entity : undefined;
export type CData<Comp>   = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Data : undefined;
export type CCode<Comp>   = Comp extends Component<infer Props, infer Entity, infer Data, infer Code> ? Code : undefined;

interface State<Entity> {
  entities: Entity[];
}

export abstract class ComponentList<
  Props,
  Comp extends Component<CProps<Comp>, CEntity<Comp>, CData<Comp>, CCode<Comp>>,
  Entity = CEntity<Comp>
> extends React.Component<Props, State<Entity>>
{
  protected abstract createObservableEntities(props: Props, arc: Arc): Observable<Entity[]>;
  protected abstract renderComponent(entity: Entity, children: any): React.ComponentElement<CProps<Comp>, any>;

  private observableEntities = memoize(
    // This will only run when the function's arguments have changed :D
    // allowing us to only recreated/refetch the entity data when the props or arc context have changed.
    // See: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization
    this.createObservableEntitiesWithProps
  );

  // Our graphql query's subscriber object
  private _subscription?: Subscription

  constructor(props: Props) {
    super(props);

    this.state = {
      entities: []
    };

    this.onQueryEntities = this.onQueryEntities.bind(this);
    this.onQueryError = this.onQueryError.bind(this);
    this.onQueryComplete = this.onQueryComplete.bind(this);
  }

  public render() {
    // TODO: support multiple children types
    const { children } = this.props;
    this.observableEntities(this.props, arc);
    const { entities } = this.state;

    // TODO: logging
    console.log("render");

    return (
      entities ? entities.map(entity => (
        <>{this.renderComponent(entity, children)}</>
      )) : <></>
    );
  }

  public componentWillMount() {
    // prefetch the entities
    this.observableEntities(this.props, arc);
  }

  public componentWillUnmount() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private createObservableEntitiesWithProps(props: Props, arc: Arc): Observable<Entity[]> | undefined {
    // TODO: logging
    this.clearPrevState();

    try {
      const entities = this.createObservableEntities(props, arc);

      // TODO: logging?

      entities.subscribe(
        this.onQueryEntities,
        this.onQueryError,
        this.onQueryComplete
      );

      return entities;
    } catch (error) {
      // TODO: logging
      return undefined;
    }
  }

  private clearPrevState() {
    this.mergeState({
      entities: undefined
    });
  }

  private onQueryEntities(entities: Entity[]) {
    // TODO: logging

    this.mergeState({
      entities: entities
    })
  }

  private onQueryError(error: Error) {
    // TODO: logging
  }

  private onQueryComplete() {
    // TODO: logging
  }

  private mergeState(merge: any) {
    this.setState(
      R.mergeDeepRight(this.state, merge)
    );
  }
}

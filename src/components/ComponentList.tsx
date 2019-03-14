import { Component } from "./Component";
import Arc from "@daostack/client";
import { Observable } from "rxjs";

// Extract the DAO's template parameters
export type CompProps<CompType>  = CompType extends Component<infer Props, infer Entity, infer Data, infer Code> ? Props : undefined;
export type CompEntity<CompType> = CompType extends Component<infer Props, infer Entity, infer Data, infer Code> ? Entity : undefined;
export type CompData<CompType>   = CompType extends Component<infer Props, infer Entity, infer Data, infer Code> ? Data : undefined;
export type CompCode<CompType>   = CompType extends Component<infer Props, infer Entity, infer Data, infer Code> ? Code : undefined;

export abstract class ComponentList<Props, Comp>
{
  protected abstract createEntities(props: Props, arc: Arc): Observable<CompEntity<Comp>[]>;

  public render() {
    // TODO:
    // 1. Component Props supports creation w/ just the entity
    // // this gets us out of the problem where you have the list,
    // // then want to change to a veiw of just the item (restarting the tree)
    // 2. Foreach entity in this list's entity array, render the <Component entity={entity}>
    // // with it's providers, then render children (support multiple child types / scenarios?)
    // // // can you see what arguments a child function has?
    // // // should we support the child not being a function?
  }
}

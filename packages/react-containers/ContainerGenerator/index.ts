import * as React from "react"

// expose: graph, views, tx methods
class ContainerGenerator<CoreComponent> implements React.Component<
  {
    config: CoreComponent.Config,
    options: CoreComponent.Options
  }>
{
  public render() {
    // TODO: get state & data
    // TODO: render children, passing down state & data
  }
}

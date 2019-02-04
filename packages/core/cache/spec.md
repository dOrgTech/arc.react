1. graphQL client (query & store)
2. connect to graph-node
3. generate bindings for subgraph?

outside:
1. redux property type (GraphData?)
2. container inited w/ required types (or received from parent? DAO?), user can ask for props, which cause a series of steps that inuvoke the query in the graphQL node and stores result in redux state.

# Given  
Data Files: Contract Source + ABI + Subgraph
Connections: Graph-Node + Web3 RPC

# Dynamically Create  
Read Interface = GraphQL Schemas + ABI View Methods
Write Interface = ABI Methods + RadSpec Annotations

This binding generation library could be implemented in any language, and would hopefully drastically reduce the overhead for UI developers.

# Thoughts After Audit...  
Hopefully this can be an easy wrapper to a protocol for frontend developers, but it does leave a lot up to them to do...

Maybe support further optimizations ontop of the auto generated graph?     

I still think this is a useful pursuit, as we want to streamline contract -> ui as much as possible.


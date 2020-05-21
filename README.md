# Arc.react

> [Arc.react](https://github.com/daostack/arc.react) componentizes [DAOstack's Arc.js library](https://github.com/daostack/arc.js), enabling easier React application integration.

**Turn any React app into a DAO enabled dApp in just:**

1...
```bash
npm i --save @daostack/arc.react`
```

2...
```html
<Arc config={new ArcConfig("rinkeby")}>
```

3...
```html
<DAO address="0xMY_DAO">
```

**Enabling you to build custom interfaces for displaying and interacting with your DAO's:**

members...
```html
<Members>
  <Member.Data>
    {(data: MemberData) => (
    <div>{data.address}</div>
    )}
  </Member.Data>
</Members>
```

proposals...

```html
<Proposals>
  <Proposal.Data>
  <Proposal.Entity>
  {(data: ProposalData, entity: ProposalEntity) => (
    <div>
      <h1>{data.title}</h1>
      <button onClick={() => entity.vote({...})}>
        Up Vote
      </button>
      <button onClick={() => entity.vote({...})}>
        Down Vote
      </button>
    </div>
  )}
  </Proposal.Entity>
  </Proposal.Data>
</Proposals>
```

**and any other entity [within the DAOstack protocol](./src/components)!**

## Read The Docs

- [examples](./documentation/examples.md)
- [architecture](./documentation/architecture.md)
- [api](./documentation/api.md)

# Build & Contribute

## Prerequisites

- nvm
- docker
- docker-compose

## Running Playground

> `nvm install`  
> `nvm use`  
> `yarn`  
> `yarn start`

## Testing

> `yarn start:subgraph`  
> `yarn test`

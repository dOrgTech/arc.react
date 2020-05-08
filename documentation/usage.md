# Usage

## Protocol Connection

TODO: update docs to show how to connect to mainnet using metamask or another other web3 providers.

First, you must connect to the Arc protocol using an [`ArcConfig`](../src/protocol/ArcConfig.ts) object like so:

```tsx
import { Arc, ArcConfig } from "@daostack/daocomponents";

const App = () => (
  <Arc config={new ArcConfig("rinkeby")}>All other components go here</Arc>
);
```

Supported networks:

- mainnet
- rinkeby
- kovan
- xdai
- private

You can also pass in your own configuration like so:
TODO: example of another network with custom settings

---

## Components

You can use every class that is an entity (a.k.a. extends from the Entity class in [Arc.js library](https://github.com/daostack/arc.js)) as a react component - Please check the [architecture section](./architecture) before going further

```ts
//Every component accepts the following props:
noSub: boolean;
```

The function of the `noSub` prop is that you can make that a component does not subscribes to changes (of data on the chain)

### DAO

```ts
Props needed:

address: string // dao address
```

```html
<DAO address='0x'>
  <DAO.Data>
    {(dao: DAOData) => <div> Name: {dao.name} </div>})
  <DAO.Data>
</DAO>
```

### Member

```ts
Props needed without infer:

address: string; //member address
dao: string; //dao address
```

```html
<Member address="0x" dao="0x">
  <Member.Data>
    {(member: MemberData) =>
    <div>Member: {member.address}</div>
    )}
  </Member.Data>
</Member>
```

```ts
Props needed using infer:

address: string; //member address
```

```html
<DAO>
  <Member address="0x">
    <Member.Data>
      {(member: MemberData) =>
      <div>Member: {member.address}</div>
      )}
    </Member.Data>
  </Member>
</DAO>
```

### Plugin

`<Plugin>` is a generic component, but you can also use the specific plugin you would like to use, you can check which one exists [here]('../src/componenents/plugins)

```ts
Props needed:

id: string; // plugin id
```

```html
<Plugin id="0x">
  <Plugin.Data>
    {(pluginInfo: PluginData) => <div> Scheme name: ${pluginInfo.name} </div> }
  </Plugin.Data>
  <Plugin.Entity>
    {(pluginEntity: PluginEntity) => (
      <button onClick={ async (e) => await pluginEntity.createProposal(...) }}>
        New proposal
      </button>
    ))}
  </Plugin.Entity>
 </Plugin>
```

Also, inferring the `Plugin` component:

```html
<Plugin id="0x">
  <ReputationFromTokenPlugin>
    <ReputationFromTokenPlugin.Data>
      {(plugin: PluginData) => (
      <div>{"Plugin name: " + plugin.name}</div>
      )}
    </ReputationFromTokenPlugin.Data>
  </ReputationFromTokenPlugin>
</Plugin>
```

### Proposal

`<Proposal>` is like Plugin component, you can see the specifics proposal implemented [here]('../src/componenents/plugins) too, but you must go inside of the plugin folder to make sure the proposal type exists on that plugin

```ts
Props needed

id: string; // proposal id
```

```html
<Proposal id="0x">
  <Proposal.Data>
    {(proposal: ProposalData) => (
    <div>{"Proposal id: " + proposal.id}</div>
    )}
  </Proposal.Data>
</Proposal>
```

```html
<Proposal id="0x">
  <ContributionRewardProposal>
    <ContributionRewardProposal.Data>
      {(proposal: ProposalData) => (
      <div>{"Proposal id: " + proposal.id}</div>
      )}
    </ContributionRewardProposal.Data>
  </ContributionRewardProposal>
</Proposal>
```

### Queue

```html
<Queue></Queue>
```

### Reputation

```html
<Reputation></Reputation>
```

### Reward

```html
<Reward></Reward>
```

### Stake

```html
<Stake></Stake>
```

### Tag

```html
<Tag></Tag>
```

### Token

```html
<Token></Token>
```

### Vote

```html
<Vote></Vote>
```

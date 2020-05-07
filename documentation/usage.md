# Usage

## Protocol set up

In order to make the components interact with blockchain, you need to import and implement the `Arc` component with an `ArcConfig` passed as config props.

To set up the `ArcConfig`, you just need to tell it to which network\* you want your component to connect, you basically need to do:

```tsx
import { Arc, ArcConfig } from "@daostack/daocomponents";

const privateConnection = new ArcConfig("rinkeby");

const MyComponent = () => (
  <Arc config={privateConnection}>
    Here is where you are going to implement all your components from the
    library
  </Arc>
);
```

\*Supported upported networks **(it must be in lowercase)**:

- mainnet
- rinkeby
- kovan
- xdai
- private

---

## Components

You can use every class that is an entity (a.k.a. extends from the Entity class in [Arc.js library](https://github.com/daostack/arc.js)) as a react component (Please check [architecture section]("./architecture") for more information)

### DAO

```ts
Props needed:

address: string // dao address
```

```html
<DAO address='0x'>
 <DAO.Data>
  {(dao: DAOData) => <div>Name: {dao.name} </div>})
 <DAO.Data>
</DAO>
```

### Member

```ts
Props accepted without infer:

address: string; //member address
dao: string; //dao address
```

```html
<Member address="{0x}" dao="{0x}">
  <Member.Data>
    {(member: MemberData =>
    <div>Member: {</div>
    )}
  </Member.Data>
</Member>
```

```ts
Props accepted using infer:

address: string; //member address
```

```html
<DAO>
  <Member address="{0x}">
    <Member.Data>
      {(member: MemberData =>
      <div>Member: {</div>
      )}
    </Member.Data>
  </Member>
</DAO>
```

### Plugin

```ts
Props needed:

id: string;
```

```html
<Plugin> </Plugin>
```

### Proposal

```html
<Proposal></Proposal>
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

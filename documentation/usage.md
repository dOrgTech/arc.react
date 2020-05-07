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

You must pass an address as a prop, this way you can access to DAO

```html
<DAO>
 <DAO.Data>
  {(dao: DAOData) => <div></div>})
 <DAO.Data>
</DAO>
```

### Member

```tsx
<Member>
```

### Plugin

```tsx
<Plugin>
```

### Proposal

```tsx
<Proposal>
```

### Queue

```tsx
<Queue>
```

### Reputation

```tsx
<Reputation>
```

### Reward

```tsx
<Reward>
```

### Stake

```tsx
<Stake>
```

### Tag

```tsx
<Tag>
```

### Token

```tsx
<Token>
```

### Vote

```tsx
<Vote>
```

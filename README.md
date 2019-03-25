# DAOcomponents  
Componentizing [DAOstack's client library](https://github.com/daostack/client), enabling easier React application integration. The hope is to be able to turn any app into a DAO enabled dApp by adding ~2 components.  

## Prerequisites  
1. node v8.10.0  
1. docker & docker-compose  

## Running  
`npm i`  
`npm run start`  

# Usage  
## Example 1: Simple Example  
`App.tsx`
```html
<DAO address="0x...">
...any component rendered in this tree will have access to this DAO's contexts
</DAO>
```
`ChildComponent.tsx`  
You can access the DAO's Data context...
```html
<div>
...
  <DAO.Data>
    {(data: DAOData) => (
      <div>
        <div>{"DAO: " + data.name}</div>
        <div>{"Token: " + data.tokenName}</div>
      </div>
    )}
  </DAO.Data>
...
</div>
```
or you can interact with its Code...
```html
<DAO.Code>
  {(code: DAOCode) => (
    <div>
      <Button onSubmit={async () => {
        await code.upvoteProposal(...)
      }} />
    </div>
  )}
</DAO.Code>
```

## Example 2: Context Aware Components
```html
<DAO address="0xMy_DAO">
...
  <Member address="0xMy_Address">
    ...
  </Member>
...
</DAO>
```

**VS**

```html
<Member address="0xMy_Address" daoAddress="0xMy_DAO">
</Member>
```

**NOTE:** Both of these examples work, but one is easier to maintain and reuse throughout your app.  

## Example 3: Component Lists
```html
<div>DAO List<div>
<DAOs>
  <div>DAO Details:</div>
  <DAO.Data>
    {(data: DAOData) => (
      <div>
        <div>{"Name: " + data.name}</div>
        <div>{"Token: " + data.tokenName}</div>
      </div>
    )}
  </DAO.Data>
</DAOs>
```

TODO: add arc/web3/graphql configuration once it's finished  
TODO: examples for two different child types (fn & components)

# Architecture  
## 1 Component, 1 Entity  
[DAOstack's client library](https://github.com/daostack/client) defines an object model where each class instance represents a semantic object within the protocol (ex: DAO, Proposal, Member). These class instances have access to the various contracts they interact with, and the semantic data model stored in a GraphQL server. Going forward, we will call these class instances "Entities".  

Each DAOcomponent creates an entity internally, and then exposes it to other components through [React Contexts](https://reactjs.org/docs/context.html).  

For Example: The component [**`<DAO address="0x...">`**](./src/components/DAO.tsx) contains an instance of [**`class DAO`**](https://github.com/daostack/client/blob/master/src/dao.ts).  

Note: ComponentLists break this rule, but will be covered further down.  

## Component Contexts (Data, Code, Prose)  
Each component has 3 parts:  
* Data - GraphQL Schema  
* Code - Abstracted Protocol Functionality  
* Prose - TBD  

Each part of the component is exposed through a [React Contexts](https://reactjs.org/docs/context.html). This allows you to use different parts of the component throughout your application, while only defining it once farther up the DOM. See "Example 1" in this document.  

## Component Lists  
For each component type, you can add an `s` after its name and it'll become a list of that entity type. For example: `DAOs`, `Proposals`, `Members`. See "Example 3" in this document.  

## Guiding Principles  
This library aims to:
* Improve Usability
* Reduce Boilerplate
* Reduce Rerendering
* Be Unobtrusively Designed
* Simple By Default, Complex If Desired
* Minimize & Encapsulate Dependencies
* Improve Logging / Tracability

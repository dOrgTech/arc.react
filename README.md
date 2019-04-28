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
<Arc config={new ArcConfig("web3", "graphql", "graphql-ws")}>
  <DAO address="0x...">
    <ExampleDAOView />
  </DAO>
</Arc>
```

Now that the DAO component has been added to the root of our application, any component rendered within its tree will have access to this DAO's contexts.  
`ExampleDAOView.tsx`  
```html
ExampleDAOView() => (
  <DAO.Data>
  {(data: DAOData) => (
    <>
    <div>{"DAO: " + data.name}</div>
    <div>{"Token: " + data.tokenName}</div>
    </>
  )}
  </DAO.Data>
)
```

You can also interact with the Code context (**NOTE:** not implemented yet):
```html
<DAO.Code>
{(code: DAOCode) => (
  <button onClick={async (e) => {
    await code.createProposal(...)
  }} />
)}
</DAO.Code>
```

## Example 2: Component Context Inference
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
<DAOs>
  <div>DAO Details:</div>
  <DAO.Data>
  {(dao: DAOData) => (
    <>
    <div>{"Name: " + dao.name}</div>
    <div>{"Token: " + dao.tokenName}</div>
    </>
  )}
  </DAO.Data>
</DAOs>
```

## Example 4: Context Forwarding
```html
<DAO.Data>
<Member.Data>
{(dao: DAOData, member: MemberData) => (
  <>
  <div>{dao.address}</div>
  <div>{member.address}</div>
  </>
)}
</Memeber.Data>
</DAO.Data>
```

## Example 5: All Together
The below example will:
* Render a list of all DAOs. For each DAO...
  * Print the DAO's name.
  * Render a list of all Members. For each member...
    * Print the Member's information.
    * Provide a button that allows you to propose a reward for that member.
```html
<DAOs>
  <DAO.Data>
  {(dao: DAOData) => (
    <div>{dao.name}</div>
  )}
  </DAO.Data>
  <Members>
    <DAO.Code>
    <Member.Data>
    {(daoCode: DAOCode, member: MemberData) => (
      <>
      <div>{member.name}<div>
      <div>{member.reputation}</div>
      <button onClick={async (e) => {
        await daoCode.createProposal(..., member.address, ...)
      }}>
      Propose Reward
      </button>
      </>
    )}
    </Member.Data>
    </DAO.Code>
  </Members>
</DAOs>
```

TODO: examples of the different supported child types (fn & components)

# Architecture  
## 1 Component, 1 Entity  
[DAOstack's client library](https://github.com/daostack/client) defines an object model where each class instance represents a semantic object within the protocol (ex: DAO, Proposal, Member). These class instances have access to the various contracts they interact with, and the semantic data model stored in a GraphQL server. Going forward, we will call these class instances "Entities".  

Each DAOcomponent creates an entity internally, and then exposes it to other components through [React Contexts](https://reactjs.org/docs/context.html).  

For Example: The component [**`<DAO address="0x...">`**](./src/components/DAO.tsx) contains an instance of [**`class DAO`**](https://github.com/daostack/client/blob/master/src/dao.ts).  

Note: ComponentLists break this rule, but will be covered further down.  

## Component Contexts (Data, Code, Prose)  
Each component has 3 core contexts:  
* Data - GraphQL Schema  
* Code - Abstracted Protocol Functionality  
* Prose - TBD  

In addition to these core contexts, you can also access:
* Entity - The raw backing entity from the client library.
* Logs - The logs associated with this component.

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

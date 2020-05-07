# DAOcomponents

Componentizing [DAOstack's client library](https://github.com/daostack/client), enabling easier React application integration. The hope is to be able to turn any app into a DAO enabled dApp by adding ~2 components.

## Prerequisites

1. node (version in the [.nvmrc](./.nvmrc))
1. docker & docker-compose

## Running

`yarn`  
`yarn start`

# Usage

## Example 1: Simple Example

`App.tsx`

```html
<Arc config="{ProdArcConfig}">
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

You can also interact with the entity context, which enables write operations to the protocol:

```html
<DAO.Entity>
  {(entity: DAOEntity) => ( <button onClick={async (e) => { await
  entity.createProposal(...) }} /> )}
</DAO.Entity>
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
<Member address="0xMy_Address" daoAddress="0xMy_DAO"> </Member>
```

**NOTE:** Both of these examples work, but one is easier to maintain and reuse throughout your app.

## Example 3: Component Lists

```html
<DAOs>
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

- Render a list of all DAOs. For each DAO...
  - Print the DAO's name.
  - Render a list of all Members. For each member...
    - Print the Member's information.
    - Provide a button that allows you to propose a reward for that member.

```html
<DAOs>
  <DAO.Data>
  {(dao: DAOData) => (
    <div>{dao.name}</div>
  )}
  </DAO.Data>
  <Members>
    <DAO.Entity>
    <Member.Data>
    {(dao: DAOEntity, memberData: MemberData) => (
      <>
      <div>{memberData.name}<div>
      <div>{memberData.reputation}</div>
      <button onClick={async (e) => {
        await dao.createProposal(..., memberData.address, ...)
      }}>
      Propose Reward
      </button>
      </>
    )}
    </Member.Data>
    </DAO.Entity>
  </Members>
</DAOs>
```

TODO: examples of the different supported child types (fn & components)

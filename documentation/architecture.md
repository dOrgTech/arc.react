# Architecture

## Guiding Principles

This library aims to:

- Improve Usability
- Reduce Boilerplate
- Reduce Rerendering
- Be Unobtrusively Designed
- Simple By Default, Complex If Desired
- Minimize & Encapsulate Dependencies
- Improve Logging / Traceability

## 1 Component, 1 Entity

[DAOstack's Arc.js library](https://github.com/daostack/arc.js) defines an object model where each class instance represents a semantic object within the protocol (ex: DAO, Proposal, Member). These class instances interact with various contract in the protocol, and query their associative data model stored in the subgraph. Going forward, we will call these class instances "Entities".

Each Arc.react component creates an entity internally, and exposes the entity and its data to other components through [React Contexts](https://reactjs.org/docs/context.html).

For Example: The component [**`<DAO address="0x...">`**](./src/components/DAO.tsx) contains an instance of [**`class DAO`**](https://github.com/daostack/arc.js/blob/master/src/dao.ts). The `class DAO` instance can be accessed via the `<DAO.Entity>`, and its queried data can be handled via `<DAO.Data>`.

Note: There are also ComponentLists, which will be covered further down.

## Component Contexts (Data, Entity, Logs)

Each component has two important [contexts](https://reactjs.org/docs/context.html):

- Data - The entity's data, queried from the [subgraph](https://github.com/daostack/subgraph).
- Entity - The entity's [Arc.js](https://github.com/daostack/arc.js) class instance, useful for write operations.

In addition to these contexts, you can also access:

- Logs - The logs associated with this component.

Each part of the component is exposed through a [React Context](https://reactjs.org/docs/context.html). This allows you to use different parts of the component throughout your application, while only defining it once farther up the DOM. See "Example 1" in [examples]('./examples).

## Component Lists

For each component type, you can add an `s` after its name and it'll become a list of that entity type. For example: `DAOs`, `Proposals`, `Members`. See "Example 3" in [examples]('./examples).

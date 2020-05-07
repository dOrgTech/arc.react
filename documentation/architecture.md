# Architecture

## 1 Component, 1 Entity

[DAOstack's client library](https://github.com/daostack/client) defines an object model where each class instance represents a semantic object within the protocol (ex: DAO, Proposal, Member). These class instances have access to the various contracts they interact with, and the semantic data model stored in a GraphQL server. Going forward, we will call these class instances "Entities".

Each DAOcomponent creates an entity internally, and then exposes it to other components through [React Contexts](https://reactjs.org/docs/context.html).

For Example: The component [**`<DAO address="0x...">`**](./src/components/DAO.tsx) contains an instance of [**`class DAO`**](https://github.com/daostack/client/blob/master/src/dao.ts).

Note: ComponentLists break this rule, but will be covered further down.

## Component Contexts (Data, Entity, Logs)

Each component has two core contexts:

- Data - GraphQL Schema
- Entity - TypeScript Class W/ Write Methods

In addition to these core contexts, you can also access:

- Logs - The logs associated with this component.

Each part of the component is exposed through a [React Contexts](https://reactjs.org/docs/context.html). This allows you to use different parts of the component throughout your application, while only defining it once farther up the DOM. See "Example 1" in this document.

## Component Lists

For each component type, you can add an `s` after its name and it'll become a list of that entity type. For example: `DAOs`, `Proposals`, `Members`. See "Example 3" in this document.

## Guiding Principles

This library aims to:

- Improve Usability
- Reduce Boilerplate
- Reduce Rerendering
- Be Unobtrusively Designed
- Simple By Default, Complex If Desired
- Minimize & Encapsulate Dependencies
- Improve Logging / Tracability

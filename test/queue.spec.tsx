import React from "react";
import {
  render,
  screen,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Arc, ArcConfig, Queue, QueueData, Queues, DAO } from "../src";

const daoAddress = "0x666a6eb4618d0438511c8206df4d5b142837eb0d";
const queueId =
  "0x01224dc8c109c350accfa915fde36a28017ca894ee2144396bd7f0861b6b0d56";
const arcConfig = new ArcConfig("private");

describe("Queue Component ", () => {
  afterEach(() => cleanup());

  it("Shows Queue ID", async () => {
    const { container } = render(
      <Arc config={arcConfig}>
        <Queue dao={daoAddress} id={queueId}>
          <Queue.Data>
            {(queue: QueueData) => <div>{"Queue id: " + queue.id}</div>}
          </Queue.Data>
        </Queue>
      </Arc>
    );
    const name = await screen.findByText(/Queue id:/);
    expect(name).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div>
        Queue id: ${queueId}
      </div>
    `);
  });
});

describe("Queue List", () => {
  afterEach(() => cleanup());

  class QueueList extends React.Component {
    render() {
      return (
        <Arc config={arcConfig}>
          Queues
          <DAO address={daoAddress}>
            <Queues from="DAO">
              <Queue.Data>
                {(queue: QueueData) => <div>{"Queue id: " + queue.id}</div>}
              </Queue.Data>
            </Queues>
          </DAO>
        </Arc>
      );
    }
  }

  it("Show list of Queues", async () => {
    const { findAllByText, findByText, queryAllByTestId } = render(
      <QueueList />
    );
    await waitFor(() => findByText(/Queue id:/), {
      timeout: 8000,
    });
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    const queues = await findAllByText(/Queue id:/);
    expect(queues.length).toBeGreaterThan(1);
  });
});

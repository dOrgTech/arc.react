import React from "react";
import {
  Arc,
  ArcConfig,
  Queue,
  QueueData,
  Queues,
  DAO,
  useQueue,
} from "../src";
import {
  render,
  screen,
  cleanup,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";

const daoAddress = "0x77510824b7169c52c4000ef8efb12542afa3ab29";
const queueId =
  "0x0002e893b562debce62e19e50e0acc1b546f80c2989f46796b604330b4f55575";
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

  it("Shows id using useQueue", async () => {
    const QueueWithHooks = () => {
      const [queueData] = useQueue();
      return <div>{"Queue id: " + queueData?.id}</div>;
    };
    const { container, findByText } = render(
      <Arc config={arcConfig}>
        <Queue dao={daoAddress} id={queueId}>
          <QueueWithHooks />
        </Queue>
      </Arc>
    );

    const name = await findByText(/Queue id:/);
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
    await waitForElementToBeRemoved(() => queryAllByTestId("default-loader"), {
      timeout: 8000,
    });
    await waitFor(() => findByText(`Queue id: ${queueId}`), {
      timeout: 8000,
    });
    const queues = await findAllByText(/Queue id:/);
    expect(queues.length).toBeGreaterThan(1);
  });
});

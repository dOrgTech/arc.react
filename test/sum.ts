test("Simple sum", () => {
  expect(3 + 5).toBe(8);
})

test("Snapshot sum", () => {
  expect(3492 + 2593).toMatchSnapshot();
})

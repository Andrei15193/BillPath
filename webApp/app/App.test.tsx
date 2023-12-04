import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("definition test", () => {
  expect(1 + 2).toBe(3);
});

test("component test", () => {
  render(<App />);

  expect(screen.getByText("Expenses")).toHaveTextContent("Expenses");
});
import { render, screen } from "@testing-library/react";
import { TestApp } from "./TestApp";

test("definition test", () => {
  expect(1 + 2).toBe(3);
});

test("component test", () => {
  render(<TestApp />);

  expect(screen.getByText("Expenses")).toHaveTextContent("Expenses");
});
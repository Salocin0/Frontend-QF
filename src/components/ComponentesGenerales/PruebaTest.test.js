import { render, screen } from "@testing-library/react";
import { PruebaTest } from "./pruebaTest";

describe("prueba", () => {
  it("must display", () => {
    render(<PruebaTest />);
    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.queryByText(/pruebaTest/i)).toBeInTheDocument();
  });
});

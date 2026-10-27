import { render, screen } from "@testing-library/react";
// El archivo real es pruebaTest.js (p minúscula). En Windows el import con
// mayúscula funcionaba por ser case-insensitive; en Linux (CI) fallaba.
import { PruebaTest } from "./pruebaTest";

describe("prueba", () => {
  it("must display", () => {
    render(<PruebaTest />);
    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.queryByText(/pruebaTest/i)).toBeInTheDocument();
  });
});

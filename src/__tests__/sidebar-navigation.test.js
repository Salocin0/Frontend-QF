import React from "react";
import { render, screen } from "@testing-library/react";
import MenuItems from "../components/ComponentesGenerales/MenuItems";
import Breadcrumb from "../components/ComponentesGenerales/Breadcrumb";

// Plain <a href> links reloaded the whole site on every click (white flash between
// screens). They must be router <Link>s, which change the route in place.
// react-router-dom is mapped to a mock in package.json, so Link is marked here.
jest.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} data-router-link="true" {...props}>
      {children}
    </a>
  ),
}));

describe("navegación sin recargar la página", () => {
  test("todos los links del menú del encargado son del router", () => {
    render(<MenuItems haveRol isResponsable />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(5);
    links.forEach((link) => expect(link).toHaveAttribute("data-router-link", "true"));
    expect(screen.getByRole("link", { name: /Mis Puestos/i })).toHaveAttribute("href", "/listado-puestos-encargado");
  });

  test("los breadcrumbs usan links del router y toleran items sin url", () => {
    render(<Breadcrumb items={[{ title: "Eventos", url: "/listado-eventos" }, { title: "Sin link" }, { title: "Productos", url: "/productos-puesto/3" }]} />);
    expect(screen.getByRole("link", { name: "Eventos" })).toHaveAttribute("data-router-link", "true");
    expect(screen.getByText("Sin link").closest("a")).toBeNull();
  });
});

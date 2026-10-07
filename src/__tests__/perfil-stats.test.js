import { buildMetrics } from "../components/ComponentesConsumidor/estadisticasPerfil/EstadisticasPerfil";
import { sortByName } from "../components/ComponentesConsumidor/FormUserPerfil";

describe("perfil: data handling never assumes arrays or complete payloads", () => {
  test("sortByName tolerates non-array backend/georef answers (regression for 'is not iterable')", () => {
    for (const bad of [undefined, null, {}, { error: "x" }, "x", 5]) {
      expect(sortByName(bad)).toEqual([]);
    }
    expect(sortByName([{ nombre: "Salta" }, { nombre: "Córdoba" }]).map((p) => p.nombre)).toEqual(["Córdoba", "Salta"]);
  });

  test("consumer metrics only for consumidor", () => {
    const titles = (role) => buildMetrics(role, {}).map((m) => m.titulo);
    expect(titles("consumidor")).toContain("Total Gastado");
    for (const role of ["productor", "repartidor", "encargado"]) {
      expect(titles(role)).not.toContain("Total Gastado");
      expect(titles(role)).not.toContain("Pedidos Realizados");
    }
  });

  test("role metrics render with missing or malformed data", () => {
    expect(buildMetrics("repartidor", null).map((m) => m.valor)).toEqual([0, 0]);
    expect(buildMetrics("productor", [1, 2]).map((m) => m.valor)).toEqual([0, "$ 0"]);
    expect(buildMetrics("repartidor", { pedidos_entregados: 60, eventos_participados: 2 }).map((m) => m.valor)).toEqual([2, 60]);
  });
});

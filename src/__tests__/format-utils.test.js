// Run the date assertions as a user in Argentina (UTC-3), where the old formatting shifted the day back.
process.env.TZ = "America/Argentina/Buenos_Aires";

import { formatDateAR } from "../components/ComponentesGenerales/Utils/formatDate";
import { formatUbicacion } from "../components/ComponentesGenerales/Utils/formatUbicacion";

describe("formatDateAR", () => {
  it("formats date-only UTC values without shifting the day", () => {
    expect(formatDateAR("2026-10-06T00:00:00.000Z")).toBe("6/10/2026");
  });

  it("does not shift date-only values back a day when the browser timezone is UTC-3", () => {
    // Guard: the timezone really is UTC-3 in this process, so the test is meaningful.
    expect(new Date("2026-10-06T12:00:00Z").getTimezoneOffset()).toBe(180);
    expect(formatDateAR("2026-10-06T00:00:00.000Z")).toBe("6/10/2026");
    expect(formatDateAR("1995-01-01T00:00:00.000Z")).toBe("1/1/1995");
    // The browser-timezone formatting is the bug being avoided.
    expect(new Date("2026-10-06T00:00:00.000Z").toLocaleDateString("es-AR")).toBe("5/10/2026");
  });

  it("returns an empty string for invalid values", () => {
    expect(formatDateAR(undefined)).toBe("");
    expect(formatDateAR("nope")).toBe("");
  });
});

describe("formatUbicacion", () => {
  it("does not repeat locality/province already present in the address", () => {
    expect(
      formatUbicacion({
        ubicacion: "Villa María, Córdoba",
        localidad: "Villa María",
        provincia: "Córdoba",
      })
    ).toBe("Villa María, Córdoba");
  });

  it("joins the available parts", () => {
    expect(
      formatUbicacion({ ubicacion: "Predio Ferial", localidad: "Cosquín", provincia: "Córdoba" })
    ).toBe("Predio Ferial, Cosquín, Córdoba");
  });

  it("ignores missing parts", () => {
    expect(formatUbicacion({ ubicacion: "Predio Ferial" })).toBe("Predio Ferial");
    expect(formatUbicacion(null)).toBe("");
  });
});

import { pickUpcomingEvents } from "../components/ComponentesLandingPage/Carrousel";

describe("pickUpcomingEvents (landing carousel)", () => {
  test("keeps only unfinished events with a date, soonest first, max 5", () => {
    const eventos = [
      { id: 1, nombre: "B", estado: "Confirmado", diaEventos: [{ fechaHoraInicioDiaEvento: "2999-02-01T10:00:00Z" }] },
      { id: 2, nombre: "A", estado: "EnCurso", diaEventos: [{ fechaHoraInicioDiaEvento: "2999-01-01T10:00:00Z" }] },
      { id: 3, nombre: "Old", estado: "Finalizado", diaEventos: [{ fechaHoraInicioDiaEvento: "2020-01-01T10:00:00Z" }] },
      { id: 4, nombre: "NoDate", estado: "Confirmado" },
    ];
    expect(pickUpcomingEvents(eventos).map((e) => e.id)).toEqual([2, 1]);
    expect(pickUpcomingEvents(null)).toEqual([]);
    const many = Array.from({ length: 9 }, (_, i) => ({ id: i, estado: "Confirmado", fechaHoraInicio: `2999-01-0${i + 1}T10:00:00Z` }));
    expect(pickUpcomingEvents(many)).toHaveLength(5);
  });
});

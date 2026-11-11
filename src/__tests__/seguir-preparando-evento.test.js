import { destinoSeguirPreparando, seguirPreparando } from '../components/ComponentesEventos/seguirPreparando';

describe('Seguir preparando: an event draft resumes its pending wizard step', () => {
  beforeEach(() => localStorage.clear());

  test('a draft in EnPreparacion1 (step 1 done) goes to step 2', () => {
    expect(destinoSeguirPreparando({ id: 19, estado: 'EnPreparacion1' })).toEqual({ path: '/registrar-evento3', state: { eventoId: 19 }, eventoDatos: null });
  });

  test('a draft in EnPreparacion2 (step 2 done) goes to step 3 with the saved dates', () => {
    const destino = destinoSeguirPreparando({ id: 20, estado: 'EnPreparacion2', fechaHoraInicio: '2026-12-01T18:00:00.000Z', fechaHoraFin: '2026-12-03T23:00:00.000Z', tienePreventa: true });
    expect(destino.path).toBe('/registrar-evento4/3');
    expect(destino.state).toEqual({ eventoId: 20 });
    expect(destino.eventoDatos).toEqual({ fechaInicio: '2026-12-01T18:00:00.000Z', fechaFin: '2026-12-03T23:00:00.000Z', tienePreventa: true, cantidadDiasEvento: 3 });
  });

  test('a draft in EnPreparacion2 without valid dates goes back to step 2', () => {
    expect(destinoSeguirPreparando({ id: 21, estado: 'EnPreparacion2', fechaHoraInicio: null }).path).toBe('/registrar-evento3');
  });

  test.each(['EnPreparacion', 'Confirmado', 'EnCurso', 'EnPreparacion3'])('an event in %s is not a draft to resume', (estado) => {
    expect(destinoSeguirPreparando({ id: 22, estado })).toBeNull();
  });

  test('navigates and leaves the wizard storage ready for step 3', () => {
    const navigate = jest.fn();
    seguirPreparando({ id: 20, estado: 'EnPreparacion2', fechaHoraInicio: '2026-12-01T18:00:00.000Z', fechaHoraFin: '2026-12-02T23:00:00.000Z', tienePreventa: false }, navigate);
    expect(navigate).toHaveBeenCalledWith('/registrar-evento4/2', { state: { eventoId: 20 } });
    expect(localStorage.getItem('eventoCreacionId')).toBe('20');
    expect(JSON.parse(localStorage.getItem('eventoDatos'))).toMatchObject({ cantidadDiasEvento: 2, tienePreventa: false });
  });
});

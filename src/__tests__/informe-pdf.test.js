import jsPDF from 'jspdf';
import {
  calcularTramos,
  claveDeMetrica,
  dibujarGraficoComparativo,
  estadoDeLectura,
  formatearValor,
  tieneGraficoComparativo,
} from '../components/PanelesDatos/informePdf';

describe('Informe PDF: capture is paged without distorting it', () => {
  test('a capture that fits goes in a single slice', () => {
    expect(calcularTramos(800, [300, 600], 1000, 1200)).toEqual([[0, 800]]);
  });

  test('cuts at the last safe boundary that fits on each page', () => {
    expect(calcularTramos(2000, [300, 700, 1100, 1500], 1000, 1000)).toEqual([
      [0, 700],
      [700, 1500],
      [1500, 2000],
    ]);
  });

  test('forces a cut when no safe boundary fits', () => {
    expect(calcularTramos(2500, [], 1000, 1000)).toEqual([
      [0, 1000],
      [1000, 2000],
      [2000, 2500],
    ]);
  });
});

describe('Informe PDF: comparative chart', () => {
  const contexto = {
    comparaciones: [
      {
        referencia: 'Otros puestos del mismo evento',
        unidades: 9,
        metricas: [
          { clave: 'ticketPromedio', metrica: 'Ticket promedio por pedido ($)', menorEsMejor: false, valor: 5200, referenciaMediana: 4800, referenciaP25: 4200, referenciaP75: 5100, referenciaMin: 3000, referenciaMax: 7000, unidadesComparadas: 9, percentil: 78, lectura: 'favorable (cuartil superior de la referencia)' },
          { metrica: 'Tiempo promedio de entrega (min)', valor: 16.8, referenciaMediana: 15, referenciaP25: null, referenciaP75: null, referenciaMin: 12, referenciaMax: 14, unidadesComparadas: 3, percentil: null, lectura: 'sin base comparativa suficiente (n=3 < 5)' },
        ],
      },
    ],
    concentracion: { puestos: 3, participacionPuestoLider: '52.4%', participacionEquitativa: '33.3%', coeficienteVariacionRecaudacion: '41.2%' },
  };

  test('formats values by metric and maps the reading to a status', () => {
    expect(formatearValor('ticketPromedio', 5200)).toBe('$ 5.200');
    expect(formatearValor('recaudadoPorPuesto', 1234567.4)).toBe('$ 1.234.567');
    expect(formatearValor('entrega', 16.8)).toBe('16,8 min');
    expect(formatearValor('valoracion', null)).toBe('—');
    expect(estadoDeLectura('favorable (cuartil superior de la referencia)')).toBe('favorable');
    expect(estadoDeLectura('desfavorable (cuartil inferior de la referencia)')).toBe('desfavorable');
    expect(estadoDeLectura('dentro del rango habitual (entre P25 y P75)')).toBe('habitual');
    expect(estadoDeLectura('sin base comparativa')).toBe('sinBase');
    expect(claveDeMetrica({ metrica: 'Tiempo promedio de entrega (min)' })).toBe('entrega');
  });

  test('only draws when there is something to compare', () => {
    expect(tieneGraficoComparativo(contexto)).toBe(true);
    expect(tieneGraficoComparativo({ comparaciones: [], concentracion: null })).toBe(false);
    expect(tieneGraficoComparativo(undefined)).toBe(false);
  });

  test('draws every row and moves to a new page when it does not fit', () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    let paginasNuevas = 0;
    const asegurarEspacio = (y, alto) => {
      if (y + alto > 277) {
        pdf.addPage();
        paginasNuevas += 1;
        return 20;
      }
      return y;
    };
    const y = dibujarGraficoComparativo(pdf, contexto, { y: 250, marginLeft: 15, contentWidth: 180, asegurarEspacio });
    expect(paginasNuevas).toBe(1);
    expect(y).toBeGreaterThan(20);
    expect(pdf.internal.getNumberOfPages()).toBe(2);
  });
});

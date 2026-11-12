import { normalizarColoresParaCaptura, esColorNoSoportado } from '../components/PanelesDatos/coloresCaptura';

// html2canvas 1.4 throws "Attempting to parse an unsupported color function" on the computed value of
// color-mix(), which made "Descargar PDF" fail on the statistics dashboards.
describe('PDF capture: unsupported CSS colors are rewritten before html2canvas', () => {
  const computed = (styles) => (element) => styles[element.id] || {};

  test('detects the color functions html2canvas cannot parse', () => {
    expect(esColorNoSoportado('color(srgb 1 0.8 0.3 / 0.45)')).toBe(true);
    expect(esColorNoSoportado('color-mix(in srgb, #fff 22%, transparent)')).toBe(true);
    expect(esColorNoSoportado('oklab(0.7 0.1 0.1)')).toBe(true);
    expect(esColorNoSoportado('rgb(255, 255, 255)')).toBe(false);
    expect(esColorNoSoportado('rgba(0, 0, 0, 0.5)')).toBe(false);
  });

  test('rewrites unsupported colors of the dashboard and its children as rgba, leaving supported ones alone', () => {
    document.body.innerHTML = '<section id="dashboard"><article id="card"><p id="text">Total</p></article></section>';
    const root = document.getElementById('dashboard');
    const convertir = jest.fn(() => 'rgba(255, 189, 89, 0.45)');
    const cambios = normalizarColoresParaCaptura(root, {
      getComputedStyle: computed({
        dashboard: { backgroundColor: 'rgb(26, 26, 26)' },
        card: { borderTopColor: 'color(srgb 1 0.74 0.35 / 0.45)', backgroundColor: 'color(srgb 0.1 0.1 0.1)', boxShadow: '0 0 4px color(srgb 0 0 0 / 0.2)' },
        text: { color: 'rgb(255, 255, 255)' },
      }),
      convertir,
    });
    const card = document.getElementById('card');
    expect(cambios).toBe(3);
    expect(card.style.borderTopColor).toBe('rgba(255, 189, 89, 0.45)');
    expect(card.style.backgroundColor).toBe('rgba(255, 189, 89, 0.45)');
    expect(card.style.boxShadow).toBe('none');
    expect(root.style.backgroundColor).toBe('');
    expect(document.getElementById('text').style.color).toBe('');
    expect(convertir).toHaveBeenCalledWith('color(srgb 1 0.74 0.35 / 0.45)');
  });
});

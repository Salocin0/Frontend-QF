import { recortarMarkdownIncompleto } from '../components/ComponentesLandingPage/chatRichText';
import { pasoDeRevelado } from '../components/ComponentesLandingPage/useTextoSuave';

describe('recortarMarkdownIncompleto (texto mientras se escribe)', () => {
  test('oculta un link a medio escribir', () => {
    expect(recortarMarkdownIncompleto('Mirá [Burger de len')).toBe('Mirá ');
    expect(recortarMarkdownIncompleto('Mirá [Burger](https://qf.app/prod')).toBe('Mirá ');
  });

  test('mantiene los links completos', () => {
    const texto = 'Mirá [Burger](https://qf.app/p?evento=1&producto=2) rica';
    expect(recortarMarkdownIncompleto(texto)).toBe(texto);
  });

  test('oculta una negrita sin cerrar y un asterisco suelto', () => {
    expect(recortarMarkdownIncompleto('Precio: **$62')).toBe('Precio: ');
    expect(recortarMarkdownIncompleto('Precio: **$6200** y *')).toBe('Precio: **$6200** y ');
    expect(recortarMarkdownIncompleto('Precio: **$6200**')).toBe('Precio: **$6200**');
  });

  test('tolera valores no string', () => {
    expect(recortarMarkdownIncompleto(undefined)).toBe('');
  });
});

describe('pasoDeRevelado', () => {
  test('avanza de a poco cuando falta poco y más rápido cuando se atrasa', () => {
    expect(pasoDeRevelado(0)).toBe(0);
    expect(pasoDeRevelado(5)).toBe(1);
    expect(pasoDeRevelado(400)).toBe(20);
    expect(pasoDeRevelado(3)).toBeLessThanOrEqual(3);
  });
});

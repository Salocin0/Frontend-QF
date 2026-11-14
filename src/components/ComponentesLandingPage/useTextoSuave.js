import { useEffect, useRef, useState } from 'react';
import { recortarMarkdownIncompleto } from './chatRichText';

// Characters revealed per animation frame: at least 1, more when far behind, so the
// text flows at a steady pace and catches up within ~20 frames after a burst.
export const pasoDeRevelado = (pendientes) =>
  pendientes <= 0 ? 0 : Math.min(pendientes, Math.max(1, Math.ceil(pendientes / 20)));

/**
 * Reveals `texto` progressively (typewriter) instead of showing each network burst at once.
 * When `animar` is false the full text is returned right away (greetings, history).
 * The not-yet-finished markdown at the end is hidden until it is complete.
 */
export default function useTextoSuave(texto, animar) {
  const objetivo = typeof texto === 'string' ? texto : '';
  const [largo, setLargo] = useState(animar ? 0 : objetivo.length);
  const largoRef = useRef(largo);
  const objetivoRef = useRef(objetivo);
  const frameRef = useRef(null);
  objetivoRef.current = objetivo;

  useEffect(() => {
    if (!animar) {
      largoRef.current = objetivo.length;
      setLargo(objetivo.length);
      return undefined;
    }
    if (frameRef.current != null) return undefined;
    const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (fn) => setTimeout(fn, 16);
    const tick = () => {
      const total = objetivoRef.current.length;
      largoRef.current += pasoDeRevelado(total - largoRef.current);
      setLargo(largoRef.current);
      frameRef.current = largoRef.current < total ? raf(tick) : null;
    };
    frameRef.current = raf(tick);
    return undefined;
  }, [objetivo, animar]);

  useEffect(
    () => () => {
      if (frameRef.current != null) {
        (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout)(frameRef.current);
      }
    },
    []
  );

  if (!animar || largo >= objetivo.length) return objetivo;
  return recortarMarkdownIncompleto(objetivo.slice(0, largo));
}

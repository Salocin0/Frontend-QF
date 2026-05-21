import { useEffect, useState } from "react";

/**
 * useBreakpoint — Detecta el breakpoint actual de la ventana.
 * Sigue los breakpoints de Bootstrap que usa el proyecto.
 *
 * @returns {{
 *   isMobile: boolean,      // < 768px
 *   isTablet: boolean,      // 768px – 991px
 *   isDesktop: boolean,     // >= 992px
 *   breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * }}
 */
const useBreakpoint = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breakpoint =
    width < 576 ? "xs"
      : width < 768 ? "sm"
        : width < 992 ? "md"
          : width < 1200 ? "lg"
            : "xl";

  return {
    isMobile: width < 768,  // xs + sm
    isTablet: width >= 768 && width < 992,
    isDesktop: width >= 992,
    breakpoint,
    width,
  };
};

export default useBreakpoint;

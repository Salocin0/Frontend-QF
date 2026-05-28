import React from 'react';
import useBreakpoint from "../../useBreakpoint";

const Inicio = () => {
  const { isMobile, isTablet } = useBreakpoint();

  const desktopStyles = {};
  const containerStyle = isMobile
    ? { display: "flex", flexDirection: "column" }
    : isTablet
    ? { ...desktopStyles, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gridTemplateAreas: "none" }
    : desktopStyles;

  return (
    <div style={containerStyle} data-testid="inicio-container">
      <h1>Inicio</h1>
    </div>
  );
};

export default Inicio;

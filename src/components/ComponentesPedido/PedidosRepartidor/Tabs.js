import React from "react";
import useDynamicColors from "../../../UseDinamicColors";

const Tabs = ({ activeTab, setActiveTab }) => {
    const Colors = useDynamicColors();
  const styles = {
    tabsWrapper: {
      display: "flex",
      justifyContent: "center",
      margin: "0 auto 1rem",
      backgroundColor: Colors.GrisAzuladoClaro,
      width: "calc(100% - 50px)",
      borderRadius: "10px",
      border: `1px solid ${Colors.Naranja}`,
      padding: "10px",
    },
    tab: {
      padding: "0.5rem 1rem",
      margin: "0 0.5rem",
      cursor: "pointer",
      borderRadius: "0.25rem",
      border: `1px solid ${Colors.GrisClaro}`,
      backgroundColor: Colors.GrisOscuro,
      color: Colors.Blanco,
      fontWeight: "bold",
    },
    activeTab: {
      backgroundColor: Colors.GrisAzuladoClaro,
      color: Colors.Negro,
      border: `1px solid ${Colors.Naranja}`,
    },
  };

  const tabs = [
    "Todos",
    "Pendientes",
    "Aceptados",
    "En Preparacion",
    "En Camino",
    "Entregados",
    "Cancelados",
  ];

  return (
    <div style={styles.tabsWrapper}>
      {tabs.map((tab) => (
        <div
          key={tab}
          style={{
            ...styles.tab,
            ...(activeTab === tab ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default Tabs;

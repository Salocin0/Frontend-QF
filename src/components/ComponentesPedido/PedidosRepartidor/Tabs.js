import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const styles = {
    tabsWrapper: {
      display: "flex",
      justifyContent: "center",
      margin: "0 auto 1rem",
      backgroundColor: "var(--qf-bg-secondary)",
      width: "calc(100% - 50px)",
      borderRadius: "10px",
      border: `1px solid var(--qf-naranja)`,
      padding: "10px",
    },
    tab: {
      padding: "0.5rem 1rem",
      margin: "0 0.5rem",
      cursor: "pointer",
      borderRadius: "0.25rem",
      border: `1px solid var(--qf-bg-card)`,
      backgroundColor: "var(--qf-text-secondary)",
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
    },
    activeTab: {
      backgroundColor: "var(--qf-bg-secondary)",
      color: "var(--qf-text-white)",
      border: `1px solid var(--qf-naranja)`,
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

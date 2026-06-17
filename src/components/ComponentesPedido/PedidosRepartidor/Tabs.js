import React, { useRef, useState, useEffect } from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const isNarrow = containerWidth > 0 && containerWidth < 950;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const styles = {
    tabsWrapper: {
      display: "flex",
      justifyContent: "center",
      flexWrap: isNarrow ? "wrap" : "nowrap",
      gap: isNarrow ? "8px" : "0",
      margin: "0 auto 1rem",
      backgroundColor: "var(--qf-bg-secondary)",
      width: "100%",
      borderRadius: "10px",
      border: `1px solid var(--qf-naranja)`,
      padding: "10px",
    },
    tab: {
      padding: "0.5rem 1rem",
      margin: isNarrow ? "0" : "0 0.5rem",
      cursor: "pointer",
      borderRadius: "0.25rem",
      border: `1px solid var(--qf-bg-card)`,
      backgroundColor: "var(--qf-text-secondary)",
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
      whiteSpace: "nowrap",
    },
    activeTab: {
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-negro-puro)",
      border: `1px solid var(--qf-naranja)`,
      fontWeight: "bold",
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
    <div ref={containerRef} style={styles.tabsWrapper}>
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

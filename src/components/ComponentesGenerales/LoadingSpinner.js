import React from "react";
import "./LoadingSpinner.css";

// Visual spinner for loading states. The label stays in the DOM for screen
// readers (the surrounding element usually has role="status") but is hidden
// visually, so users see the spinner instead of a "Cargando…" text.
const LoadingSpinner = ({ label = "Cargando…" }) => (
  <span className="qf-loading-spinner">
    <span className="qf-loading-spinner__ring" aria-hidden="true" />
    <span className="qf-loading-spinner__label">{label}</span>
  </span>
);

export default LoadingSpinner;

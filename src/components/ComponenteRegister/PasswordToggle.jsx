import React, { useState } from "react";

const PasswordToggle = ({ inputId, value, onChange, placeholder, style, name }) => {
  const [showPassword, setShowPassword] = useState(false);
  const ICON = "ICON";

  const togglePasswordVisibility = (e) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        id={inputId}
        type={showPassword ? "text" : "password"}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
        name={name}
      />
      <span
        onClick={togglePasswordVisibility}
        style={{
          position: "absolute",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          color: "#888"
        }}
      >
        {ICON}
      </span>
    </div>
  );
};

export default PasswordToggle;

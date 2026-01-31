import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordToggle = ({ inputId, value, onChange, placeholder, style, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.stopPropagation();
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <FaLock style={{
        position: "absolute",
        left: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#888"
      }} />
      <input
        id={inputId}
        type={showPassword ? "text" : "password"}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...style, paddingLeft: "40px" }}
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
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
  );
};

export default PasswordToggle;

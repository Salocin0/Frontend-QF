import React from "react";
import { Spinner } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const LoandingComponent = () => {
    return (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          minHeight: "200px"
        }}>
          <Spinner color="warning" style={{ width: '3rem', height: '3rem' }} />
        </div>
      );
};

export default LoandingComponent;

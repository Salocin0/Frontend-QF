import React from "react";
import { Spinner } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const LoandingComponent = () => {
    return (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="warning" />
        </div>
      );
};

export default LoandingComponent;

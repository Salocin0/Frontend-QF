import React from "react";
import { Spinner } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const LoandingComponent = ({mensaje}) => {
    return (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="warning" />
        </div>
      );
};

export default LoandingComponent;

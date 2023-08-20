import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./landingPage.css";

const ComoFunciona = () => {
  return (
    <div className="como-funciona h-100">
      <div className="row h-100">
        <div className="col-md-5 offset-1">
          <h2 className="text-center mt-3">Cómo Funciona</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
            risus nec urna sollicitudin luctus. Nullam vel dui in metus eleifend
            convallis non ut ipsum.
          </p>
          <div className="items-container flex-column">
            <div className="item pt-2">
              <i className="bi bi-1-circle-fill"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
            risus nec urna sollicitudin luctus. Nullam vel dui in metus eleifend
            convallis non ut ipsum.</p>
            </div>

            <div className="item pt-2">
              <i className="bi bi-2-circle-fill"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
            risus nec urna sollicitudin luctus. Nullam vel dui in metus eleifend
            convallis non ut ipsum.</p>
            </div>

            <div className="item pt-2">
              <i className="bi bi-3-circle-fill"></i>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget
            risus nec urna sollicitudin luctus. Nullam vel dui in metus eleifend
            convallis non ut ipsum..</p>
            </div>
          </div>
        </div>
        <div className="col-md-5 offset-1 divimagen h-100">
        </div>
      </div>
    </div>
  );
};

export default ComoFunciona;

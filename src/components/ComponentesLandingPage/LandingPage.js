import React from "react";
import Footer from "../ComponentesGenerales/Footer";
import ComoFunciona from "./ComoFunciona";
import Imagenes from "./Imagenes";
import Navbar from "./Navbar";
import FloatingButton from "./FloatingButton";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <FloatingButton />
      <Imagenes />

      <section className="ComoFunciona pb-3">
        <ComoFunciona />
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;

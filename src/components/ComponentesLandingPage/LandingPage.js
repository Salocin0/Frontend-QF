import React from "react";
import Footer from "../ComponentesGenerales/Footer";
import ComoFunciona from "./ComoFunciona";
import Imagenes from "./Imagenes";
import Navbar from "./Navbar";
import FloatingButton from "./FloatingButton";
import useBreakpoint from "../../useBreakpoint";

const LandingPage = () => {
  const { isMobile } = useBreakpoint();
  console.log('REACT_APP_BACK_URL', process.env.REACT_APP_BACK_URL);
  return (
    <div data-testid="landing-page" style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />
      <FloatingButton />
      <Imagenes />

      <section
        className="ComoFunciona pb-3"
        style={{ width: "100%", maxWidth: isMobile ? "100%" : "1200px", margin: "0 auto" }}
      >
        <ComoFunciona />
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;

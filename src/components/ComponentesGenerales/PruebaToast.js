import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PruebasToast = () => {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setContador(prevContador => prevContador + 1);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    toast.success("Toast Success");
    toast.error("Toast Error");
    toast.warn("Toast Warn");
    toast.info("Toast Info");
  }, [contador]);

  return <div>pruebasToast</div>;
};

export default PruebasToast;

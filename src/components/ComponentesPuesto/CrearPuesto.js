import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { FaStore, FaImage, FaFileAlt, FaSave, FaArrowLeft } from "react-icons/fa";
import "./CrearPuesto.css";

const CrearNuevoPuesto = () => {
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const [numeroCarro, setNumeroCarro] = useState("");
  const [nombreCarro, setNombreCarro] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [telefonoCarro, setTelefonoCarro] = useState("");
  const [pdfAfip, setPdfAfip] = useState(null);
  const [pdfCuil, _setPdfCuil] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);
  const [bannerBase64, setBannerBase64] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileToBase64(file, (base64) => {
      setLogoBase64(base64);
    });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileToBase64(file, (base64) => {
      setBannerBase64(base64);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busy.current) return;
    const formData = {
      numeroCarro,
      nombreCarro,
      tipoNegocio,
      pdfAfip,
      pdfCuil,
      logo: logoBase64,
      banner: bannerBase64,
      telefonoCarro,
      consumidorId: user.consumidorId,
    };

    if (!pdfAfip) {
      toast.error("Debe adjuntar la constancia de AFIP");
      return;
    }

    if (!numeroCarro || !nombreCarro || !tipoNegocio || !telefonoCarro) {
      toast.error("Por favor rellene todos los datos");
      return;
    }

    // Native "required" bubbles are disabled (noValidate) so every message is shown in Spanish.
    if (!logoBase64 || !bannerBase64) {
      toast.error("Debe adjuntar el logo y el banner");
      return;
    }

    busy.current = true;
    setSaving(true);
    fetch(`${process.env?.REACT_APP_BACK_URL}puesto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Carro de comida registrado correctamente");
          navigate("/listado-puestos-encargado");
        } else {
          toast.error("Ya existe un carro con el ID ingresado.");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el carro de comida");
      })
      .finally(() => { busy.current = false; setSaving(false); });
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-create-stand-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }, { title: "Crear puesto", url: "/crear-puesto" }]} />
        <header className="qf-create-stand-heading"><div><h1>Crear un puesto</h1><p>Completá la información y prepará la presentación de tu puesto de comida.</p></div>{!saving && <Link className="qf-create-stand-button" to="/listado-puestos-encargado"><FaArrowLeft aria-hidden="true" /> Volver</Link>}</header>
        <form className="qf-create-stand-form" onSubmit={handleSubmit} noValidate>
          <fieldset disabled={saving}>
            <legend><FaStore aria-hidden="true" /> Datos del puesto</legend>
            <p className="qf-create-stand-help">Los datos que identifican tu negocio y permiten contactarte.</p>
            <div className="qf-create-stand-fields">
              <label htmlFor="nombreCarro">Nombre Carro<input id="nombreCarro" value={nombreCarro} onChange={(event) => setNombreCarro(event.target.value)} placeholder="Ej.: Puesto Cuarteto" required /></label>
              <label htmlFor="idCarro">Número de Carro<input id="idCarro" type="number" min="1" value={numeroCarro} onChange={(event) => setNumeroCarro(event.target.value)} placeholder="Número identificador" required /></label>
              <label htmlFor="tipoNegocio">Tipo de Negocio<select id="tipoNegocio" value={tipoNegocio} onChange={(event) => setTipoNegocio(event.target.value)} required><option value="" disabled>Seleccioná un tipo de negocio</option>
                  <option value="Heladería">Heladería</option>
                  <option value="Pizzería">Pizzería</option>
                  <option value="Restaurante">Restaurante</option>
                  <option value="Hamburguesería">Hamburguesería</option>
                  <option value="Rotisería">Rotisería</option>
                  <option value="Panadería">Panadería</option>
                  <option value="Comida rápida">Comida rápida</option>
                  <option value="Parrilla">Parrilla</option>
                  <option value="Comida vegana/vegetariana">Comida vegana/vegetariana</option>
                  <option value="Café / Deli">Café / Deli</option>
                  <option value="Empanadas / Tartas">Empanadas / Tartas</option>
                  <option value="Comida mexicana">Comida mexicana</option>
                  <option value="Comida árabe">Comida árabe</option>
                  <option value="Sushi / Comida japonesa">Sushi / Comida japonesa</option>
                  <option value="Otros">Otros</option>

              </select></label>
              <label htmlFor="telefonoCarro">Teléfono<input id="telefonoCarro" type="tel" value={telefonoCarro} onChange={(event) => setTelefonoCarro(event.target.value)} placeholder="Ej.: 351 123 4567" required /></label>
            </div>
          </fieldset>
          <fieldset className="qf-create-stand-section" disabled={saving}>
            <legend><FaImage aria-hidden="true" /> Imagen de tu puesto</legend>
            <p className="qf-create-stand-help">Elegí un logo y una imagen para presentar tu negocio.</p>
            <div className="qf-create-stand-uploads">
              <div><div className="qf-create-stand-preview qf-create-stand-preview--logo">{logoBase64 ? <img src={logoBase64} alt="Vista previa del logo" /> : <FaStore aria-hidden="true" />}</div><label htmlFor="logo">Logo<input id="logo" type="file" accept="image/*" onChange={handleLogoChange} required /></label></div>
              <div><div className="qf-create-stand-preview">{bannerBase64 ? <img src={bannerBase64} alt="Vista previa del banner" /> : <FaImage aria-hidden="true" />}</div><label htmlFor="banner">Banner<input id="banner" type="file" accept="image/*" onChange={handleBannerChange} required /></label></div>
            </div>
          </fieldset>
          <fieldset className="qf-create-stand-section" disabled={saving}>
            <legend><FaFileAlt aria-hidden="true" /> Documentación</legend>
            <div className="qf-create-stand-fields qf-create-stand-documents">
              <label htmlFor="pdfAfip">Constancia de inscripción a AFIP<input type="file" id="pdfAfip" onChange={(event) => setPdfAfip(event.target.files?.[0] || null)} required /></label>
              <label htmlFor="pdfCuil">Constancia de Inspección Bromatológica<input type="file" id="pdfCuil" onChange={(event) => _setPdfCuil(event.target.files?.[0] || null)} required /></label>
            </div>
          </fieldset>
          <footer className="qf-create-stand-footer"><span>Revisá los datos antes de registrar tu puesto.</span><button type="submit" className="qf-create-stand-button qf-create-stand-button--primary" disabled={saving}><FaSave aria-hidden="true" />{saving ? "Registrando…" : "Registrar Carro de Comida"}</button></footer>
        </form>
      </main><Footer />
    </PageLayout>
  );
};
export default CrearNuevoPuesto;

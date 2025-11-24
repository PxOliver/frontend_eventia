import React from "react";
import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

function FooterEventia() {
  return (
    <footer className="bg-dark text-white pt-4 pb-3 shadow-lg mt-0">
      <div className="container text-center">
        <h5 className="fw-bold mb-3 text-uppercase">Eventia</h5>
        <p className="text-secondary mb-3">
          Tu espacio ideal para cada evento, a un clic de distancia.
        </p>
        <div className="mb-3">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white mx-3 fs-5">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white mx-3 fs-5">
            <FaInstagram />
          </a>
          <a href="mailto:contacto@eventia.com" className="text-white mx-3 fs-5">
            <FaEnvelope />
          </a>
        </div>
        <hr className="bg-secondary" style={{ opacity: 0.3 }} />
        <p className="mb-0 text-secondary">
          © 2025 <span className="text-white fw-semibold">Eventia</span> — Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}

export default FooterEventia;
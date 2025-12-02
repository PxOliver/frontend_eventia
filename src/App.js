import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import AdministradorPanel from "./pages/AdministradorPanel";
import PropietarioPanel from "./pages/PropietarioPanel";
import ClientePanel from "./pages/ClientePanel";
import DetallePropiedad from "./pages/DetallePropiedad";
import CategoriasPropiedades from "./pages/CategoriasPropiedades";
import VerificarCuenta from "./pages/VerificarCuenta";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<AdministradorPanel />} />
        <Route path="/propietario" element={<PropietarioPanel />} />
        <Route path="/cliente" element={<ClientePanel />} />
        <Route path="/propiedad/:id" element={<DetallePropiedad />} />
        <Route path="/categorias" element={<CategoriasPropiedades />} />
        <Route path="/verificar" element={<VerificarCuenta />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
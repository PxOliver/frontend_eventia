import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout, getPerfilLocal } from "../api/authService";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

function NavbarEventia() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/perfil`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPerfil(res.data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    if (rol) cargarPerfil();
  }, [rol]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      className="shadow-sm"
      style={{ background: "linear-gradient(90deg, #3B1E5A, #5C2A9D)" }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white fw-bold fs-4">
          <span style={{ color: "#FFD700" }}>E</span>ventia
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 bg-light" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            {/* LINKS PÚBLICOS */}
            <Nav.Link
              as={Link}
              to="/"
              className="text-white mx-2 fw-semibold nav-link-custom"
            >
              Inicio
            </Nav.Link>

            {!rol && (
              <>
                <Nav.Link
                  as={Link}
                  to="/registro"
                  className="text-white mx-2 fw-semibold nav-link-custom"
                >
                  Registro
                </Nav.Link>

                <Button
                  as={Link}
                  to="/login"
                  variant="warning"
                  className="ms-3 px-4 fw-semibold"
                >
                  Iniciar Sesión
                </Button>
              </>
            )}

            {/* LINKS POR ROL */}
            {rol && (
              <>
                {rol === "ADMIN" && (
                  <Nav.Link
                    as={Link}
                    to="/admin"
                    className="text-white mx-2 fw-semibold nav-link-custom"
                  >
                    Panel Admin
                  </Nav.Link>
                )}

                {rol === "PROPIETARIO" && (
                  <Nav.Link
                    as={Link}
                    to="/propietario"
                    className="text-white mx-2 fw-semibold nav-link-custom"
                  >
                    Panel Propietario
                  </Nav.Link>
                )}

                {rol === "CLIENTE" && (
                  <Nav.Link
                    as={Link}
                    to="/cliente"
                    className="text-white mx-2 fw-semibold nav-link-custom"
                  >
                    Panel Cliente
                  </Nav.Link>
                )}

                {/* LINK A PERFIL */}
                <Nav.Link
                  as={Link}
                  to="/perfil"
                  className="text-white mx-2 fw-semibold nav-link-custom d-flex align-items-center"
                >
                  {/* Avatar si existe */}
                  {perfil?.fotoPerfil ? (
                    <Image
                      src={perfil.fotoPerfil}
                      roundedCircle
                      width="32"
                      height="32"
                      className="me-2 border border-light"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Image
                      src="https://via.placeholder.com/32x32?text=?"
                      roundedCircle
                      width="32"
                      height="32"
                      className="me-2 border border-light"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  Mi Perfil
                </Nav.Link>

                {/* LOG OUT */}
                <Button
                  variant="outline-light"
                  className="ms-3"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Estilos personalizados */}
      <style>{`
        .nav-link-custom {
          transition: color 0.3s ease;
        }
        .nav-link-custom:hover {
          color: #FFD700 !important;
        }
      `}</style>
    </Navbar>
  );
}

export default NavbarEventia;
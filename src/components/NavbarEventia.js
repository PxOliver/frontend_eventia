import React from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/authService";

function NavbarEventia() {
  const navigate = useNavigate();
  const rol = localStorage.getItem("rol");

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
            <Nav.Link as={Link} to="/" className="text-white mx-2 fw-semibold nav-link-custom">
              Inicio
            </Nav.Link>
            {!rol && (
              <>
                <Nav.Link as={Link} to="/registro" className="text-white mx-2 fw-semibold nav-link-custom">
                  Registro
                </Nav.Link>
                <Button as={Link} to="/login" variant="warning" className="ms-3 px-4 fw-semibold">
                  Iniciar Sesión
                </Button>
              </>
            )}
            {rol && (
              <>
                {rol === "ADMIN" && <Nav.Link as={Link} to="/admin" className="text-white mx-2 fw-semibold nav-link-custom">Panel Admin</Nav.Link>}
                {rol === "PROPIETARIO" && <Nav.Link as={Link} to="/propietario" className="text-white mx-2 fw-semibold nav-link-custom">Panel Propietario</Nav.Link>}
                {rol === "CLIENTE" && <Nav.Link as={Link} to="/cliente" className="text-white mx-2 fw-semibold nav-link-custom">Panel Cliente</Nav.Link>}
                <Button variant="outline-light" className="ms-3" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
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
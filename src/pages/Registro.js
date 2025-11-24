import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import { register } from "../api/authService";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      await register({ nombre, apellido, email, password, rol });

      setMensaje(
        "📩 Registro exitoso. Revisa tu correo para verificar tu cuenta antes de iniciar sesión."
      );

      // limpiar formulario
      setNombre("");
      setApellido("");
      setEmail("");
      setPassword("");
      setRol("");

    } catch (err) {
      console.error(err);
      setError("❌ Error al registrarse. Verifica los datos.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarEventia />
      <div
        className="flex-fill d-flex justify-content-center align-items-center"
        style={{
          background:
            "linear-gradient(rgba(59,30,90,0.85), rgba(92,42,157,0.85)), url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container className="d-flex justify-content-center align-items-center">
          <Card
            className="card-elevated p-4 border-0"
            style={{
              width: "26rem",
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <h3 className="text-center mb-1 page-title text-primary">
              Crear Cuenta
            </h3>
            <p className="text-center text-muted mb-4">
              Regístrate para comenzar a usar Eventia.
            </p>

            {mensaje && <Alert variant="success">{mensaje}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option value="">Selecciona un rol</option>
                  <option value="CLIENTE">Cliente</option>
                  <option value="PROPIETARIO">Propietario</option>
                </Form.Select>
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" className="fw-bold">
                  Registrarse
                </Button>
              </div>
            </Form>

            <hr className="my-4" />

            <p className="text-center mb-0">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary fw-semibold">
                Inicia sesión
              </Link>
            </p>
          </Card>
        </Container>
      </div>

      <FooterEventia />
    </div>
  );
}

export default Registro;
import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { login } from "../api/authService";
import { API_BASE_URL } from "../api/config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mostrarReenviar, setMostrarReenviar] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMostrarReenviar(false);

    try {
      const data = await login(email, password);

      if (data.rol === "ADMIN") navigate("/admin");
      else if (data.rol === "PROPIETARIO") navigate("/propietario");
      else navigate("/cliente");

    } catch (err) {
      if (err.response?.data === "NO_VERIFICADO") {
        setError("⚠️ Tu cuenta no está verificada. Revisa tu correo.");
        setMostrarReenviar(true);
      } else {
        setError("❌ Correo o contraseña incorrectos.");
      }
    }
  };

  const reenviarCorreo = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/resend-verification?email=${encodeURIComponent(email)}`
      );
      alert("📩 Correo enviado nuevamente. Revisa tu bandeja.");
    } catch (err) {
      alert("No se pudo reenviar el correo.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarEventia />

      <div
        className="flex-fill d-flex justify-content-center align-items-center"
        style={{
          background:
            "linear-gradient(rgba(59,30,90,0.85), rgba(92,42,157,0.85)), url('https://images.unsplash.com/photo-1521540216272-a50305cd4421?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container className="d-flex justify-content-center align-items-center">
          <Card
            className="card-elevated p-4 border-0"
            style={{ width: "25rem", backgroundColor: "rgba(255,255,255,0.95)" }}
          >
            <h3 className="text-center mb-1 page-title text-primary">Iniciar Sesión</h3>
            <p className="text-center text-muted mb-4">
              Accede a tu cuenta para continuar.
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* BOTÓN REENVIAR VERIFICACIÓN */}
            {mostrarReenviar && (
              <div className="text-center mb-3">
                <Button variant="outline-primary" size="sm" onClick={reenviarCorreo}>
                  Reenviar correo de verificación
                </Button>
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" size="lg" type="submit">
                  Ingresar
                </Button>
              </div>
            </Form>

            <hr className="my-4" />

            <p className="text-center mb-0">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-primary fw-semibold">
                Regístrate aquí
              </Link>
            </p>
          </Card>
        </Container>
      </div>

      <FooterEventia />
    </div>
  );
}

export default Login;
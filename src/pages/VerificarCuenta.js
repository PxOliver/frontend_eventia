import React, { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

const API_URL = `${API_BASE_URL}/auth`;

function VerificarCuenta() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [estado, setEstado] = useState("LOADING"); 
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const activarCuenta = async () => {
    try {
      const res = await axios.post(`${API_URL}/verify`, { token });

      // Guardar JWT
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);
      localStorage.setItem("nombre", res.data.nombre);

      setEstado("OK");
      setMensaje("Cuenta verificada. Iniciando sesión...");

      setTimeout(() => {
        if (res.data.rol === "ADMIN") navigate("/admin");
        else if (res.data.rol === "PROPIETARIO") navigate("/propietario");
        else navigate("/cliente");
      }, 2500);

    } catch (err) {
      setEstado("ERROR");
      setMensaje("El enlace no es válido o ya fue usado.");
    }
  };

  useEffect(() => {
    if (!token) {
      setEstado("ERROR");
      setMensaje("Token inválido.");
    } else {
      setEstado("READY"); // listo para presionar el botón
      setMensaje("Haz clic para activar tu cuenta.");
    }
  }, [token]);

  return (
    <Container className="min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="p-4 text-center shadow" style={{ maxWidth: 450 }}>
        
        {estado === "READY" && (
          <>
            <h3 className="fw-bold text-primary">Verificación de cuenta</h3>
            <p>{mensaje}</p>
            <Button variant="success" size="lg" onClick={activarCuenta}>
              Activar mi cuenta
            </Button>
          </>
        )}

        {estado === "LOADING" && (
          <>
            <Spinner animation="border" />
            <p>Preparando verificación...</p>
          </>
        )}

        {estado === "OK" && (
          <Alert variant="success">
            {mensaje} <br /> Redirigiendo...
          </Alert>
        )}

        {estado === "ERROR" && (
          <Alert variant="danger">{mensaje}</Alert>
        )}

      </Card>
    </Container>
  );
}

export default VerificarCuenta;
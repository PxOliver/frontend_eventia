import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col, Alert, Spinner, Form } from "react-bootstrap";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { getAuthHeader, isLoggedIn } from "../api/authService";
import { API_BASE_URL } from "../api/config";

function DetallePropiedad() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [comentarios, setComentarios] = useState([]); // <<< NUEVO

  const API_URL = `${API_BASE_URL}/propiedades/${id}`;
  const hoy = new Date().toISOString().split("T")[0]; // <<< NUEVO

  useEffect(() => {
    // <<< NUEVO: propiedad y comentarios por separado
    const fetchPropiedad = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(API_URL);
        setPropiedad(data);
      } catch (err) {
        console.error(err);
        setError("❌ No se pudo cargar la propiedad. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    const fetchComentarios = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/comentarios/propiedad/${id}`
        );
        setComentarios(data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
        // no rompemos la vista, solo dejamos comentarios = []
      }
    };

    fetchPropiedad();
    fetchComentarios();
    // <<< FIN NUEVO
  }, [API_URL, id]);

  const handleReservar = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    if (!fechaInicio || !fechaFin) {
      setMensaje("⚠️ Debes seleccionar ambas fechas para continuar.");
      return;
    }

    const hoyStr = new Date().toISOString().split("T")[0];

    if (fechaInicio < hoyStr || fechaFin < hoyStr) {
      setMensaje("❌ No puedes reservar fechas pasadas.");
      return;
    }

    if (fechaFin < fechaInicio) {
      setMensaje("❌ La fecha fin no puede ser anterior a la fecha inicio.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/reservas`,
        {
          fechaInicio,
          fechaFin,
          propiedadId: propiedad.id,
        },
        { headers: getAuthHeader() }
      );

      setMensaje("✅ Reserva creada con éxito.");
      setFechaInicio("");
      setFechaFin("");
      setTimeout(() => navigate("/cliente"), 1200);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        setMensaje("❌ Sesión expirada. Inicia sesión nuevamente.");
        setTimeout(() => navigate("/login"), 1200);
        return;
      }
      if (error.response?.data?.message) {
        setMensaje(`❌ ${error.response.data.message}`);
      } else {
        setMensaje("❌ No se pudo crear la reserva.");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavbarEventia />
        <Container className="flex-fill d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </Container>
        <FooterEventia />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavbarEventia />
        <Container className="flex-fill d-flex justify-content-center align-items-center">
          <Alert variant="danger">{error}</Alert>
        </Container>
        <FooterEventia />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarEventia />
      <div className="flex-fill section-gradient py-5">
        <Container>
          <Card className="card-elevated overflow-hidden">
            <Row className="g-0">
              <Col md={6}>
                <Card.Img
                  src={
                    propiedad.imagen ||
                    "https://via.placeholder.com/600x400.png?text=Sin+Imagen"
                  }
                  alt={propiedad.nombre}
                  style={{ height: "100%", objectFit: "cover" }}
                />
              </Col>
              <Col md={6}>
                <Card.Body className="p-4">
                  <h2 className="fw-bold text-primary mb-3">
                    {propiedad.nombre}
                  </h2>
                  <p className="mb-1">
                    <strong>Tipo:</strong> {propiedad.tipo}
                  </p>
                  <p className="mb-1">
                    <strong>Capacidad:</strong> {propiedad.capacidad} personas
                  </p>
                  <p className="mb-3">
                    <strong>Precio:</strong>{" "}
                    <span className="text-success fw-semibold">
                      S/ {propiedad.precio?.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-secondary">{propiedad.descripcion}</p>

                  <hr />
                  <h5 className="fw-semibold mb-3">Reservar</h5>
                  {mensaje && <Alert variant="info">{mensaje}</Alert>}

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha inicio</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaInicio}
                        min={hoy}
                        onChange={(e) => setFechaInicio(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha fin</Form.Label>
                      <Form.Control
                        type="date"
                        value={fechaFin}
                        min={fechaInicio || hoy}
                        onChange={(e) => setFechaFin(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      className="fw-semibold w-100 btn-eventia-primary"
                      onClick={handleReservar}
                    >
                      Reservar ahora
                    </Button>
                  </Form>

                  <Button
                    as={Link}
                    to="/"
                    variant="outline-primary"
                    className="mt-3 w-100"
                  >
                    ← Volver
                  </Button>
                </Card.Body>
              </Col>
            </Row>
          </Card>

          {/* Comentarios */}
          <div className="mt-4">
            <h4 className="fw-bold text-primary mb-3">Comentarios</h4>

            {comentarios.length === 0 ? (
              <p className="text-muted">
                Aún no hay comentarios para esta propiedad.
              </p>
            ) : (
              comentarios.map((c) => (
                <Card
                  key={c.id}
                  className="mb-3 shadow-sm border-0 rounded-3"
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>{c.usuario?.nombre || "Usuario"}</strong>
                      <span>
                        {"★".repeat(c.calificacion) +
                          "☆".repeat(5 - c.calificacion)}
                      </span>
                    </div>
                    <small className="text-muted">
                      {c.fecha ? c.fecha.substring(0, 10) : ""}
                    </small>
                    <p className="mb-0 mt-2">{c.contenido}</p>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Container>
      </div>
      <FooterEventia />
    </div>
  );
}

export default DetallePropiedad;
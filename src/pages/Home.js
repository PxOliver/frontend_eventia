import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form, Alert, Spinner } from "react-bootstrap";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

function Home() {
  const [propiedades, setPropiedades] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = `${API_BASE_URL}/propiedades`;

  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL); // Público: no requiere token
        setPropiedades(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("❌ No se pudieron cargar las propiedades. Intenta más tarde.");
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  const propiedadesFiltradas = propiedades.filter(
    (p) =>
      p.nombre.toLowerCase().includes(filtro.toLowerCase()) &&
      (tipo === "" || p.tipo === tipo)
  );

  // Mostrar solo 3 propiedades en la página de inicio
  const propiedadesDestacadas = propiedadesFiltradas.slice(0, 3);

  return (
    <>
      <NavbarEventia />

      <section
        className="text-white text-center d-flex align-items-center justify-content-center hero-eventia"
        style={{ height: "60vh" }}
      >
        <Container>
          <h1 className="display-5 fw-bold mb-3">
            Encuentra el lugar perfecto para tu evento
          </h1>
          <p className="lead mb-4">
            Salones, jardines y haciendas a tu disposición con solo un clic.
          </p>
          <Button
            variant="warning"
            size="lg"
            href="/login"
            className="fw-semibold px-4"
          >
            Empezar ahora
          </Button>
        </Container>
      </section>

      <div className="section-gradient py-5">
        <Container>
          <Card className="card-elevated p-4">
            <h2 className="text-center text-primary fw-bold mb-4">
              Busca tu espacio ideal
            </h2>

            <Form className="d-flex justify-content-center gap-3 flex-wrap mb-4">
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o ubicación"
                style={{ width: "250px", maxWidth: "90%" }}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
              <Form.Select
                style={{ width: "200px", maxWidth: "90%" }}
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Tipo</option>
                <option value="SALON">Salón</option>
                <option value="JARDIN">Jardín</option>
                <option value="HACIENDA">Hacienda</option>
                <option value="LOCAL">Local</option>
              </Form.Select>
            </Form>

            {loading && (
              <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" variant="primary" />
              </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
              <>
                {propiedadesDestacadas.length === 0 ? (
                  <p className="text-center text-muted">
                    No se encontraron espacios con esos filtros.
                  </p>
                ) : (
                  <>
                    <Row>
                      {propiedadesDestacadas.map((p) => (
                        <Col key={p.id} md={4} className="mb-4">
                          <Card className="h-100 shadow-sm border-0 rounded-4">
                            <Card.Img
                              variant="top"
                              src={
                                p.imagen ||
                                "https://via.placeholder.com/400x250.png?text=Sin+Imagen"
                              }
                              alt={p.nombre}
                              style={{
                                height: "200px",
                                objectFit: "cover",
                                borderTopLeftRadius: "0.75rem",
                                borderTopRightRadius: "0.75rem",
                              }}
                            />
                            <Card.Body className="d-flex flex-column align-items-center text-center justify-content-center">
                              <Card.Title className="text-primary fw-bold">
                                {p.nombre}
                              </Card.Title>
                              <Card.Text className="text-muted mb-1">
                                Tipo: <strong>{p.tipo}</strong>
                              </Card.Text>
                              <Card.Text className="text-success fw-semibold mb-3">
                                S/ {p.precio?.toFixed(2)}
                              </Card.Text>
                              <Button
                                as={Link}
                                variant="outline-primary"
                                to={`/propiedad/${p.id}`}
                              >
                                Ver detalles
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <div className="text-center mt-4">
                      <Button
                        as={Link}
                        to="/categorias"
                        variant="primary"
                        size="lg"
                        className="fw-semibold px-5 btn-eventia-primary"
                      >
                        Ver todas las propiedades
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </Card>
        </Container>
      </div>

      <FooterEventia />
    </>
  );
}

export default Home;
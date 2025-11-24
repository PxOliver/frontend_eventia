import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Alert,
  Spinner,
  Tabs,
  Tab,
} from "react-bootstrap";
import { FaHome } from "react-icons/fa";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

function CategoriasPropiedades() {
  const [propiedades, setPropiedades] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [tipoActivo, setTipoActivo] = useState("TODOS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = `${API_BASE_URL}/propiedades`;

  useEffect(() => {
    const fetchPropiedades = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        setPropiedades(res.data);
      } catch (err) {
        console.error(err);
        setError("❌ No se pudieron cargar las propiedades. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchPropiedades();
  }, []);

  const categorias = ["TODOS", "SALON", "JARDIN", "HACIENDA", "LOCAL"];

  const propiedadesFiltradas = propiedades.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <NavbarEventia />

      <section
        className="text-white text-center d-flex align-items-center justify-content-center hero-eventia"
        style={{ height: "45vh" }}
      >
        <Container>
          <h1 className="display-6 fw-bold mb-3">Todas nuestras categorías</h1>
          <p className="lead mb-0">
            Explora todas las opciones disponibles para tu evento ideal
          </p>
        </Container>
      </section>

      <div className="section-gradient py-5">
        <Container>
          <Card className="card-elevated p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
              <div>
                <h2 className="page-title text-primary mb-1">
                  Categorías de propiedades
                </h2>
                <p className="text-muted mb-0">
                  Filtra por tipo de espacio y encuentra el que mejor se adapta a ti.
                </p>
              </div>
              <Form.Control
                type="text"
                placeholder="Buscar propiedades..."
                style={{ width: "260px" }}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="mt-3 mt-md-0"
              />
            </div>

            {loading && (
              <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" variant="primary" />
              </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
              <Tabs
                activeKey={tipoActivo}
                onSelect={(k) => setTipoActivo(k)}
                className="mb-3"
                fill
              >
                {categorias.map((categoria) => {
                  const propiedadesCategoria =
                    categoria === "TODOS"
                      ? propiedadesFiltradas
                      : propiedadesFiltradas.filter((p) => p.tipo === categoria);

                  const count =
                    categoria === "TODOS"
                      ? propiedadesFiltradas.length
                      : propiedadesFiltradas.filter((p) => p.tipo === categoria)
                          .length;

                  return (
                    <Tab
                      key={categoria}
                      eventKey={categoria}
                      title={
                        <>
                          {categoria === "TODOS" && (
                            <FaHome className="me-1 mb-1" />
                          )}
                          {categoria}
                          <span className="ms-2 badge bg-primary">{count}</span>
                        </>
                      }
                    >
                      <div className="mt-4">
                        {propiedadesCategoria.length === 0 ? (
                          <p className="text-center text-muted">
                            No hay propiedades en esta categoría.
                          </p>
                        ) : (
                          <Row>
                            {propiedadesCategoria.map((p) => (
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
                                      className="px-4"
                                    >
                                      Ver detalles
                                    </Button>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        )}
                      </div>
                    </Tab>
                  );
                })}
              </Tabs>
            )}
          </Card>
        </Container>
      </div>

      <FooterEventia />
    </>
  );
}

export default CategoriasPropiedades;
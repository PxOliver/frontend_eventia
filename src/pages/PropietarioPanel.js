import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Table,
  Modal,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { getAuthHeader } from "../api/authService";
import { API_BASE_URL } from "../api/config";

function PropietarioPanel() {
  const [propiedades, setPropiedades] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // false = nueva, true = editar
  const [propiedadEditando, setPropiedadEditando] = useState(null);

  const [nuevaPropiedad, setNuevaPropiedad] = useState({
    nombre: "",
    tipo: "SALON",
    capacidad: "",
    precio: "",
    imagen: "",
    descripcion: "",
  });
  const [mensaje, setMensaje] = useState("");

  // imagen local
  const [imagenFile, setImagenFile] = useState(null);
  const [previewImagen, setPreviewImagen] = useState("");

  const API_PROP_LIST = `${API_BASE_URL}/propiedades/mis-propiedades`;
  const API_PROP_CREATE = `${API_BASE_URL}/propiedades`;
  const API_RESERVAS = `${API_BASE_URL}/reservas/propietario`;
  const API_UPLOAD_IMAGEN = `${API_BASE_URL}/propiedades/imagen`;

  // Cargar propiedades y reservas del propietario
  useEffect(() => {
    cargarPropiedades();
    cargarReservas();
  }, []);

  const cargarPropiedades = async () => {
    try {
      const res = await axios.get(API_PROP_LIST, { headers: getAuthHeader() });
      setPropiedades(res.data);
    } catch (error) {
      console.error("Error al cargar propiedades:", error);
      setMensaje("❌ Error al cargar propiedades.");
    }
  };

  const cargarReservas = async () => {
    try {
      const res = await axios.get(API_RESERVAS, { headers: getAuthHeader() });
      setReservas(res.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setMensaje("❌ Error al cargar reservas.");
    }
  };

  // Confirmar reserva
  const confirmarReserva = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/reservas/${id}/confirmar`,
        {},
        { headers: getAuthHeader() }
      );
      setMensaje("✅ Reserva confirmada.");
      cargarReservas();
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ No se pudo confirmar la reserva.");
    }
  };

  // Rechazar reserva
  const rechazarReserva = async (id) => {
    if (!window.confirm("¿Seguro que deseas rechazar esta reserva?")) return;

    try {
      await axios.put(
        `http://localhost:8080/api/reservas/${id}/rechazar`,
        {},
        { headers: getAuthHeader() }
      );
      setMensaje("❌ Reserva rechazada.");
      cargarReservas();
    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ No se pudo rechazar la reserva.");
    }
  };

  // Cambiar archivo de imagen
  const handleImagenFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagenFile(null);
      setPreviewImagen("");
      return;
    }

    setImagenFile(file);
    setPreviewImagen(URL.createObjectURL(file));
    // si sube archivo, opcionalmente vaciamos el campo URL
    setNuevaPropiedad((prev) => ({ ...prev, imagen: "" }));
  };

  // Abrir modal en modo "nueva propiedad"
  const abrirModalNueva = () => {
    setModoEdicion(false);
    setPropiedadEditando(null);
    setNuevaPropiedad({
      nombre: "",
      tipo: "SALON",
      capacidad: "",
      precio: "",
      imagen: "",
      descripcion: "",
    });
    setImagenFile(null);
    setPreviewImagen("");
    setShowModal(true);
  };

  // Abrir modal en modo "editar propiedad"
  const abrirModalEditar = (prop) => {
    setModoEdicion(true);
    setPropiedadEditando(prop);
    setNuevaPropiedad({
      nombre: prop.nombre || "",
      tipo: prop.tipo || "SALON",
      capacidad: prop.capacidad || "",
      precio: prop.precio || "",
      imagen: prop.imagen || "",
      descripcion: prop.descripcion || "",
    });
    setImagenFile(null);
    setPreviewImagen(prop.imagen || "");
    setShowModal(true);
  };

  // Guardar (crear o editar) propiedad
  const handleGuardarPropiedad = async (e) => {
    e.preventDefault();

    try {
      let payload = { ...nuevaPropiedad };

      // Si hay archivo seleccionado, primero subirlo
      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);

        const resUpload = await axios.post(API_UPLOAD_IMAGEN, formData, {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        });

        if (resUpload.data?.url) {
          payload.imagen = resUpload.data.url;
        }
      }

      if (!modoEdicion) {
        // CREAR
        const res = await axios.post(API_PROP_CREATE, payload, {
          headers: getAuthHeader(),
        });
        setPropiedades((prev) => [...prev, res.data]);
        setMensaje("✅ Propiedad agregada correctamente.");
      } else {
        // EDITAR
        const id = propiedadEditando.id;
        const res = await axios.put(`${API_PROP_CREATE}/${id}`, payload, {
          headers: getAuthHeader(),
        });

        setPropiedades((prev) =>
          prev.map((p) => (p.id === id ? res.data : p))
        );
        setMensaje("✅ Propiedad actualizada correctamente.");
      }

      // Reset modal/form
      setNuevaPropiedad({
        nombre: "",
        tipo: "SALON",
        capacidad: "",
        precio: "",
        imagen: "",
        descripcion: "",
      });
      setImagenFile(null);
      setPreviewImagen("");
      setPropiedadEditando(null);
      setModoEdicion(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar propiedad:", error);
      setMensaje("❌ Error al guardar la propiedad.");
    }
  };

  // Eliminar propiedad
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta propiedad?")) return;
    try {
      await axios.delete(`${API_PROP_CREATE}/${id}`, {
        headers: getAuthHeader(),
      });
      setPropiedades((prev) => prev.filter((p) => p.id !== id));
      setMensaje("✅ Propiedad eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      setMensaje("❌ Error al eliminar propiedad.");
    }
  };

  // Badge de estado
  const badgeEstado = (estado) => {
    switch (estado) {
      case "CONFIRMADA":
        return <Badge bg="success">Confirmada</Badge>;
      case "CANCELADA":
        return <Badge bg="danger">Rechazada</Badge>; // en BD queda CANCELADA, pero mostramos Rechazada
      default:
        return (
          <Badge bg="warning" text="dark">
            Pendiente
          </Badge>
        );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarEventia />

      <div className="flex-fill section-gradient py-5">
        <Container>
          <Card className="card-elevated p-4">
            {/* Header del panel */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="text-primary fw-bold page-title mb-1">
                  Panel del Propietario
                </h2>
                <p className="text-muted mb-0">
                  Administra tus propiedades y las reservas recibidas.
                </p>
              </div>
              <Button variant="success" onClick={abrirModalNueva}>
                + Agregar Propiedad
              </Button>
            </div>

            {mensaje && <Alert variant="info">{mensaje}</Alert>}

            {/* Tabla de propiedades */}
            <Table
              hover
              responsive
              className="align-middle mb-5 text-center table-modern"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Capacidad</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {propiedades.map((prop) => (
                  <tr key={prop.id}>
                    <td>{prop.id}</td>
                    <td>{prop.nombre}</td>
                    <td>{prop.tipo}</td>
                    <td>{prop.capacidad}</td>
                    <td>S/ {prop.precio?.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => abrirModalEditar(prop)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleEliminar(prop.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Tabla de reservas */}
            <h4 className="text-primary fw-bold mb-4 text-center">
              Reservas Recibidas
            </h4>

            <Table
              bordered
              hover
              responsive
              className="text-center mb-5 table-modern"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Propiedad</th>
                  <th>Cliente</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.propiedad?.nombre}</td>
                    <td>{r.usuario?.nombre}</td>
                    <td>{r.fechaInicio}</td>
                    <td>{r.fechaFin}</td>
                    <td>{badgeEstado(r.estado)}</td>
                    <td>
                      {r.estado === "PENDIENTE" ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => confirmarReserva(r.id)}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => rechazarReserva(r.id)}
                          >
                            Rechazar
                          </Button>
                        </>
                      ) : (
                        <small className="text-muted">Sin acciones</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Galería */}
            <h4 className="text-primary fw-bold mb-4 text-center">
              Galería de Propiedades
            </h4>

            <Row className="g-4 justify-content-center">
              {propiedades.map((prop) => (
                <Col md={6} lg={4} key={prop.id}>
                  <Card className="h-100 text-center shadow-sm border-0 rounded-4">
                    <Card.Img
                      src={
                        prop.imagen ||
                        "https://via.placeholder.com/400x250.png?text=Sin+Imagen"
                      }
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{prop.nombre}</Card.Title>
                      <Card.Text className="text-success">
                        S/ {prop.precio?.toFixed(2)}
                      </Card.Text>
                      <Card.Text className="text-secondary">
                        {prop.descripcion}
                      </Card.Text>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => abrirModalEditar(prop)}
                      >
                        Editar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Container>
      </div>

      <FooterEventia />

      {/* Modal para agregar / editar propiedad */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {modoEdicion ? "Editar Propiedad" : "Agregar Propiedad"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleGuardarPropiedad}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={nuevaPropiedad.nombre}
                onChange={(e) =>
                  setNuevaPropiedad({
                    ...nuevaPropiedad,
                    nombre: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                value={nuevaPropiedad.tipo}
                onChange={(e) =>
                  setNuevaPropiedad({
                    ...nuevaPropiedad,
                    tipo: e.target.value,
                  })
                }
              >
                <option value="SALON">Salón</option>
                <option value="JARDIN">Jardín</option>
                <option value="LOCAL">Local</option>
                <option value="HACIENDA">Hacienda</option>
                <option value="OTRO">Otro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                value={nuevaPropiedad.capacidad}
                onChange={(e) =>
                  setNuevaPropiedad({
                    ...nuevaPropiedad,
                    capacidad: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio (S/)</Form.Label>
              <Form.Control
                type="number"
                value={nuevaPropiedad.precio}
                onChange={(e) =>
                  setNuevaPropiedad({
                    ...nuevaPropiedad,
                    precio: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            {/* Campo URL de imagen */}
            <Form.Group className="mb-3">
              <Form.Label>Imagen (URL)</Form.Label>
              <Form.Control
                value={nuevaPropiedad.imagen}
                onChange={(e) =>
                  setNuevaPropiedad({
                    ...nuevaPropiedad,
                    imagen: e.target.value,
                  })
                }
                placeholder="https://..."
              />
              <Form.Text className="text-muted">
                Puedes pegar una URL directa de imagen o subir un archivo desde tu
                dispositivo.
              </Form.Text>
            </Form.Group>

            {/* Subir archivo desde dispositivo */}
            <Form.Group className="mb-3">
              <Form.Label>Subir imagen desde tu dispositivo</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImagenFileChange}
              />
              <Form.Text className="text-muted">
                Si seleccionas un archivo, se subirá al guardar la propiedad y se
                usará la URL generada.
              </Form.Text>

              {(previewImagen || nuevaPropiedad.imagen) && (
                <div className="mt-3 text-center">
                  <p className="mb-1 text-muted">Vista previa:</p>
                  <img
                    src={previewImagen || nuevaPropiedad.imagen}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "0.75rem",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nuevaPropiedad.descripcion}
                onChange={(e) =>
                  setNuevaPropiedad({
                    ...nuevaPropiedad,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              {modoEdicion ? "Guardar cambios" : "Guardar propiedad"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PropietarioPanel;
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaCommentDots,
  FaMoneyBillWave,
  FaTimes,
  FaCreditCard,
  FaMobileAlt,
  FaWallet,
} from "react-icons/fa";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { getAuthHeader } from "../api/authService";
import { API_BASE_URL } from "../api/config";

function ClientePanel() {
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const [showPagoModal, setShowPagoModal] = useState(false);
  const [pagoMonto, setPagoMonto] = useState("");
  const [pagoFecha, setPagoFecha] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pagoMetodo, setPagoMetodo] = useState("EFECTIVO");
  const [reservaParaPagar, setReservaParaPagar] = useState(null);
  const [pagoResumen, setPagoResumen] = useState(null);
  const [procesandoPago, setProcesandoPago] = useState(false);

  // Campos sólo visuales para tarjeta (no se envían al backend)
  const [cardNumero, setCardNumero] = useState("");
  const [cardNombre, setCardNombre] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const API_URL = API_BASE_URL;

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const res = await axios.get(`${API_URL}/reservas/cliente`, {
        headers: getAuthHeader(),
      });
      setReservas(res.data);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setMensaje("❌ Error al cargar reservas.");
    }
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Deseas cancelar esta reserva?")) return;

    try {
      await axios.put(
        `${API_URL}/reservas/${id}/cancelar`,
        {},
        { headers: getAuthHeader() }
      );
      setMensaje("✅ Reserva cancelada correctamente.");
      cargarReservas();
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      setMensaje("❌ No se pudo cancelar la reserva.");
    }
  };

  const handleComentar = (reserva) => {
    setSelectedReserva(reserva);
    setShowModal(true);
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/comentarios`,
        {
          contenido: comentario,
          calificacion: calificacion,
          usuario_id: selectedReserva.usuario.id,
          propiedad_id: selectedReserva.propiedad.id,
        },
        { headers: getAuthHeader() }
      );

      setMensaje("✅ Comentario enviado correctamente.");
      setComentario("");
      setCalificacion(5);
      setShowModal(false);
    } catch (error) {
      console.error("Error al enviar comentario:", error);
      setMensaje("❌ No se pudo enviar el comentario.");
    }
  };

  const handlePagar = (reserva) => {
    setReservaParaPagar(reserva);

    const precioDia = reserva.propiedad?.precio || 0;

    const inicio = new Date(reserva.fechaInicio + "T00:00:00");
    const fin = new Date(reserva.fechaFin + "T00:00:00");
    let diffMs = fin - inicio;
    let dias = diffMs / (1000 * 60 * 60 * 24) + 1;
    if (isNaN(dias) || dias < 1) dias = 1;

    const total = precioDia * dias;

    setPagoMonto(total.toFixed(2));
    setPagoFecha(new Date().toISOString().split("T")[0]);
    setPagoMetodo("EFECTIVO");

    setPagoResumen({
      propiedad: reserva.propiedad?.nombre,
      fechaInicio: reserva.fechaInicio,
      fechaFin: reserva.fechaFin,
      precioDia: precioDia,
      dias: dias,
      total: total.toFixed(2),
    });

    // reset simulaciones
    setCardNumero("");
    setCardNombre("");
    setCardExp("");
    setCardCvv("");

    setShowPagoModal(true);
  };

  const handleEnviarPago = async (e) => {
    e.preventDefault();
    if (!reservaParaPagar) return;

    setProcesandoPago(true);

    try {
      await axios.post(
        `${API_URL}/pagos`,
        {
          monto: Number(pagoMonto),
          fecha: pagoFecha,
          metodo: pagoMetodo, // EFECTIVO / TARJETA / YAPE (igual que el enum)
          reserva: { id: reservaParaPagar.id },
        },
        { headers: getAuthHeader() }
      );

      let msg = "✅ Pago registrado correctamente previa coordinación.";
      if (pagoMetodo === "EFECTIVO") {
        msg =
          "✅ Registro guardado. El pago en efectivo se realizará previa coordinación directa con el propietario.";
      } else if (pagoMetodo === "YAPE") {
        msg =
          "✅ Pago por Yape registrado. No olvides enviar el voucher al propietario para que lo confirme.";
      }

      setMensaje(msg);
      setShowPagoModal(false);
      setReservaParaPagar(null);
      setPagoResumen(null);
    } catch (error) {
      console.error("Error al registrar pago:", error);
      setMensaje("❌ No se pudo registrar el pago.");
    } finally {
      setProcesandoPago(false);
    }
  };

  const obtenerBadge = (estado) => {
    const e = estado?.toUpperCase();
    switch (e) {
      case "CONFIRMADA":
        return (
          <Badge bg="success" className="badge-soft">
            Confirmada
          </Badge>
        );
      case "CANCELADA":
        return (
          <Badge bg="danger" className="badge-soft">
            Cancelada
          </Badge>
        );
      case "PENDIENTE":
      default:
        return (
          <Badge bg="warning" text="dark" className="badge-soft">
            Pendiente
          </Badge>
        );
    }
  };

  const isMetodoTarjeta = pagoMetodo === "TARJETA";
  const isMetodoYape = pagoMetodo === "YAPE";
  const isMetodoEfectivo = pagoMetodo === "EFECTIVO";

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarEventia />

      <div className="text-center flex-fill section-gradient py-5">
        <Container>
          <div className="mb-4">
            <h2 className="page-title text-primary mb-1">Panel del Cliente</h2>
            <p className="text-muted mb-0">
              Revisa el estado de tus reservas y gestiona tus pagos de manera
              segura.
            </p>
          </div>

          <div className="card-elevated bg-white p-3">
            {mensaje && <Alert variant="info">{mensaje}</Alert>}

            <Table
              bordered
              hover
              responsive
              className="shadow-sm mb-0 text-center table-modern"
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Propiedad</th>
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
                    <td>{r.propiedad?.nombre || "Sin datos"}</td>
                    <td>{r.fechaInicio}</td>
                    <td>{r.fechaFin}</td>
                    <td>{obtenerBadge(r.estado)}</td>
                    <td>
                      {r.estado?.toUpperCase() === "PENDIENTE" && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleCancelar(r.id)}
                        >
                          <FaTimes className="me-1" /> Cancelar
                        </Button>
                      )}

                      {r.estado?.toUpperCase() === "CONFIRMADA" && (
                        <>
                          <Button
                            variant="outline-success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleComentar(r)}
                          >
                            <FaCommentDots className="me-1" />
                            Comentar
                          </Button>

                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handlePagar(r)}
                          >
                            <FaMoneyBillWave className="me-1" />
                            Pagar reserva
                          </Button>
                        </>
                      )}

                      {r.estado?.toUpperCase() === "CANCELADA" && (
                        <small className="text-muted">Sin acciones</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>

      <FooterEventia />

      {/* Modal comentario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Comentar Propiedad</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleEnviarComentario}>
            <Form.Group className="mb-3">
              <Form.Label>Calificación (1 a 5)</Form.Label>
              <Form.Select
                value={calificacion}
                onChange={(e) => setCalificacion(parseInt(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {"★".repeat(n) + "☆".repeat(5 - n)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido del comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe tu experiencia..."
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" className="fw-semibold">
                Enviar Comentario
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal pago */}
      <Modal
        show={showPagoModal}
        onHide={() => setShowPagoModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Registrar pago</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            {/* Resumen de la reserva */}
            <Col md={5} className="mb-3 mb-md-0">
              {pagoResumen && (
                <div
                  className="p-3 h-100 rounded-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #5C2A9D, #8C52FF, #FFD54F)",
                    color: "white",
                  }}
                >
                  <h5 className="fw-bold mb-2">Resumen de la reserva</h5>
                  <p className="mb-1">
                    <strong>Propiedad:</strong> {pagoResumen.propiedad}
                  </p>
                  <p className="mb-1">
                    <strong>Fechas:</strong> {pagoResumen.fechaInicio} al{" "}
                    {pagoResumen.fechaFin}
                  </p>
                  <p className="mb-1">
                    <strong>Precio por día:</strong> S/{" "}
                    {pagoResumen.precioDia?.toFixed(2)}
                  </p>
                  <p className="mb-1">
                    <strong>Días reservados:</strong> {pagoResumen.dias}
                  </p>
                  <hr className="border-light" />
                  <h4 className="fw-bold mb-0">
                    Total a pagar:{" "}
                    <span className="text-warning">
                      S/ {pagoResumen.total}
                    </span>
                  </h4>
                </div>
              )}
            </Col>

            {/* Formulario de pago */}
            <Col md={7}>
              <Form onSubmit={handleEnviarPago}>
                <Form.Group className="mb-3">
                  <Form.Label>Monto total (S/)</Form.Label>
                  <Form.Control
                    type="number"
                    value={pagoMonto}
                    onChange={(e) => setPagoMonto(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                  <Form.Text className="text-muted">
                    Puedes ajustar el monto si es necesario.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de pago</Form.Label>
                  <Form.Control
                    type="date"
                    value={pagoFecha}
                    onChange={(e) => setPagoFecha(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Método de pago</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    <Form.Check
                      type="radio"
                      id="metodo-efectivo"
                      name="metodo"
                      label={
                        <>
                          <FaWallet className="me-1" /> Efectivo
                        </>
                      }
                      checked={pagoMetodo === "EFECTIVO"}
                      onChange={() => setPagoMetodo("EFECTIVO")}
                    />
                    <Form.Check
                      type="radio"
                      id="metodo-tarjeta"
                      name="metodo"
                      label={
                        <>
                          <FaCreditCard className="me-1" /> Tarjeta
                        </>
                      }
                      checked={pagoMetodo === "TARJETA"}
                      onChange={() => setPagoMetodo("TARJETA")}
                    />
                    <Form.Check
                      type="radio"
                      id="metodo-yape"
                      name="metodo"
                      label={
                        <>
                          <FaMobileAlt className="me-1" /> Yape
                        </>
                      }
                      checked={pagoMetodo === "YAPE"}
                      onChange={() => setPagoMetodo("YAPE")}
                    />
                  </div>
                  <Form.Text className="text-muted">
                    * Esta simulación es solo visual, no se realizan cobros
                    reales.
                  </Form.Text>
                </Form.Group>

                {/* EFECTIVO: simulación de coordinación */}
                {isMetodoEfectivo && (
                  <div className="mb-3 p-3 border rounded-3 bg-light text-start">
                    <p className="fw-semibold mb-2">
                      Pago en efectivo (previa coordinación)
                    </p>
                    <ul className="mb-0">
                      <li>
                        El propietario recibirá la notificación de que deseas
                        pagar en efectivo.
                      </li>
                      <li>
                        Toda la coordinación como lugar, fecha y hora
                        para entregar el dinero será previa coordinación con el propietario.
                      </li>
                      <li>
                        Una vez realizado el pago, el propietario entregará el
                        acceso al espacio o propiedad.
                      </li>
                    </ul>
                  </div>
                )}

                {/* TARJETA: simulación */}
                {isMetodoTarjeta && (
                  <div className="mb-3 p-3 border rounded-3 bg-light">
                    <p className="mb-2 fw-semibold">Datos de tarjeta</p>
                    <Form.Group className="mb-2">
                      <Form.Label>Número de tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumero}
                        onChange={(e) => setCardNumero(e.target.value)}
                        maxLength={19}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Nombre en la tarjeta</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nombre Apellido"
                        value={cardNombre}
                        onChange={(e) => setCardNombre(e.target.value)}
                      />
                    </Form.Group>
                    <div className="d-flex gap-2">
                      <Form.Group className="mb-2 flex-fill">
                        <Form.Label>Vencimiento</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="MM/AA"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          maxLength={5}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2" style={{ width: "120px" }}>
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="***"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                        />
                      </Form.Group>
                    </div>
                  </div>
                )}

                {/* YAPE: simulación QR */}
                {isMetodoYape && (
                  <div className="mb-3 p-3 border rounded-3 bg-light text-center">
                    <p className="fw-semibold mb-2">
                      Paga con Yape escaneando este código
                    </p>
                    <img
                      src="https://pepestubroaster.com/wp-content/uploads/QR-Yape-Pepes-Tu-Broaster.jpg"
                      alt="Código QR Yape"
                      style={{
                        width: "160px",
                        height: "160px",
                        marginBottom: "10px",
                        borderRadius: "12px",
                        objectFit: "cover",
                      }}
                    />
                    <p className="text-muted mb-0">
                      Escanea el código con tu app Yape y luego envía el voucher
                      al propietario para que confirme el pago.
                    </p>
                  </div>
                )}

                <div className="d-grid">
                  <Button
                    variant="success"
                    type="submit"
                    className="fw-semibold"
                    disabled={procesandoPago}
                  >
                    {procesandoPago ? "Procesando pago..." : "Guardar pago"}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ClientePanel;
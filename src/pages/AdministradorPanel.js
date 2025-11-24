import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Tabs,
  Tab,
  Alert,
  Card,
} from "react-bootstrap";
import {
  FaUsers,
  FaHome,
  FaClipboardList,
  FaMoneyBillWave,
} from "react-icons/fa";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { getAuthHeader } from "../api/authService";
import { API_BASE_URL } from "../api/config";

function AdministradorPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const API_URL = API_BASE_URL;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resUsuarios = await axios.get(`${API_URL}/usuarios`, {
        headers: getAuthHeader(),
      });
      const resPropiedades = await axios.get(`${API_URL}/propiedades`, {
        headers: getAuthHeader(),
      });
      const resReservas = await axios.get(`${API_URL}/reservas`, {
        headers: getAuthHeader(),
      });
      const resPagos = await axios.get(`${API_URL}/pagos`, {
        headers: getAuthHeader(),
      });

      setUsuarios(resUsuarios.data);
      setPropiedades(resPropiedades.data);
      setReservas(resReservas.data);
      setPagos(resPagos.data);
    } catch (err) {
      console.error(err);
      setError("❌ Error al cargar los datos del panel.");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await axios.delete(`${API_URL}/usuarios/${id}`, {
        headers: getAuthHeader(),
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setMensaje("✅ Usuario eliminado correctamente.");
    } catch (err) {
      console.error(err);
      setError("❌ Error al eliminar usuario.");
    }
  };

  const eliminarPropiedad = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta propiedad?")) return;
    try {
      await axios.delete(`${API_URL}/propiedades/${id}`, {
        headers: getAuthHeader(),
      });
      setPropiedades((prev) => prev.filter((p) => p.id !== id));
      setMensaje("✅ Propiedad eliminada correctamente.");
    } catch (err) {
      console.error(err);
      setError("❌ Error al eliminar propiedad.");
    }
  };

  const eliminarReserva = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
      await axios.delete(`${API_URL}/reservas/${id}`, {
        headers: getAuthHeader(),
      });
      setReservas((prev) => prev.filter((r) => r.id !== id));
      setMensaje("✅ Reserva eliminada correctamente.");
    } catch (err) {
      console.error(err);
      setError("❌ Error al eliminar reserva.");
    }
  };

  const obtenerBadge = (estado) => {
    switch (estado) {
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
      default:
        return (
          <Badge bg="warning" text="dark" className="badge-soft">
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
          {/* TÍTULO CENTRADO */}
          <div className="text-center mb-4">
            <h2 className="page-title text-primary mb-2">
              Panel del Administrador
            </h2>
            <p className="text-muted mb-0">
              Gestiona usuarios, propiedades, reservas y pagos desde un solo
              lugar.
            </p>
          </div>

          {mensaje && (
            <Alert
              variant="success"
              onClose={() => setMensaje("")}
              dismissible
            >
              {mensaje}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          <Card className="card-elevated p-3">
            <Tabs defaultActiveKey="usuarios" className="mb-3" fill>
              {/* Usuarios */}
              <Tab
                eventKey="usuarios"
                title={
                  <>
                    <FaUsers className="me-2" /> Usuarios
                  </>
                }
              >
                <div className="mt-3">
                  <Table
                    bordered
                    hover
                    responsive
                    className="text-center mb-0 table-modern"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>
                            {u.nombre} {u.apellido}
                          </td>
                          <td>{u.email}</td>
                          <td>{u.rol}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => eliminarUsuario(u.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              {/* Propiedades */}
              <Tab
                eventKey="propiedades"
                title={
                  <>
                    <FaHome className="me-2" /> Propiedades
                  </>
                }
              >
                <div className="mt-3">
                  <Table
                    bordered
                    hover
                    responsive
                    className="text-center mb-0 table-modern"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Disponibilidad</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propiedades.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.nombre}</td>
                          <td>{p.tipo}</td>
                          <td>S/ {p.precio?.toFixed(2)}</td>
                          <td>
                            {p.disponible ? (
                              <Badge bg="success" className="badge-soft">
                                Disponible
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="badge-soft">
                                No disponible
                              </Badge>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => eliminarPropiedad(p.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              {/* Reservas */}
              <Tab
                eventKey="reservas"
                title={
                  <>
                    <FaClipboardList className="me-2" /> Reservas
                  </>
                }
              >
                <div className="mt-3">
                  <Table
                    bordered
                    hover
                    responsive
                    className="text-center mb-0 table-modern"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Propiedad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((r) => (
                        <tr key={r.id}>
                          <td>{r.id}</td>
                          <td>{r.usuario?.nombre || "Sin datos"}</td>
                          <td>{r.propiedad?.nombre || "Sin datos"}</td>
                          <td>{obtenerBadge(r.estado)}</td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => eliminarReserva(r.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              {/* Pagos */}
              <Tab
                eventKey="pagos"
                title={
                  <>
                    <FaMoneyBillWave className="me-2" /> Pagos
                  </>
                }
              >
                <div className="mt-3">
                  <Table
                    bordered
                    hover
                    responsive
                    className="text-center mb-0 table-modern"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Reserva</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                        <th>Método</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagos.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.reserva?.id}</td>
                          <td>S/ {p.monto?.toFixed(2)}</td>
                          <td>{p.fecha}</td>
                          <td>{p.metodo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </Card>
        </Container>
      </div>

      <FooterEventia />
    </div>
  );
}

export default AdministradorPanel;
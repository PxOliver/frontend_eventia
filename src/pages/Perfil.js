import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaUserCircle, FaCamera, FaLock } from "react-icons/fa";
import NavbarEventia from "../components/NavbarEventia";
import FooterEventia from "../components/FooterEventia";
import axios from "axios";
import { getAuthHeader } from "../api/authService";
import { API_BASE_URL } from "../api/config";

function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Estados para cambiar contraseña ---
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passRepetir, setPassRepetir] = useState("");
  const [mensajePass, setMensajePass] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  const API_PERFIL = `${API_BASE_URL}/perfil`;
  const API_AVATAR = `${API_BASE_URL}/perfil/avatar`;
  const API_PASSWORD = `${API_BASE_URL}/perfil/password`;

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await axios.get(API_PERFIL, {
          headers: getAuthHeader(),
        });
        setPerfil(res.data);
        setNombre(res.data.nombre || "");
        setApellido(res.data.apellido || "");
        setFotoPerfil(res.data.fotoPerfil || "");
        setPreview(res.data.fotoPerfil || "");
      } catch (err) {
        setError("❌ No se pudo cargar tu perfil.");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [API_PERFIL]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagenFile(null);
      setPreview(fotoPerfil);
      return;
    }
    setImagenFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setSaving(true);

    try {
      let fotoUrl = fotoPerfil;

      if (imagenFile) {
        const formData = new FormData();
        formData.append("file", imagenFile);

        const resUpload = await axios.post(API_AVATAR, formData, {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        });

        if (resUpload.data?.url) {
          fotoUrl = resUpload.data.url;
          setFotoPerfil(fotoUrl);
        }
      }

      const resUpdate = await axios.put(
        API_PERFIL,
        {
          nombre,
          apellido,
          fotoPerfil: fotoUrl,
        },
        {
          headers: getAuthHeader(),
        }
      );

      setPerfil(resUpdate.data);
      setMensaje("✅ Perfil actualizado correctamente.");
    } catch (err) {
      setError("❌ No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    setMensajePass("");
    setErrorPass("");

    if (passNueva !== passRepetir) {
      setErrorPass("❌ Las nuevas contraseñas no coinciden.");
      return;
    }

    setLoadingPass(true);

    try {
      const res = await axios.put(
        API_PASSWORD,
        { actual: passActual, nueva: passNueva },
        { headers: getAuthHeader() }
      );

      if (res.data === "CONTRASENA_CAMBIADA") {
        setMensajePass("✅ Contraseña cambiada correctamente.");
        setPassActual("");
        setPassNueva("");
        setPassRepetir("");
      }
    } catch (err) {
      if (err.response?.data === "CONTRASENA_INCORRECTA") {
        setErrorPass("❌ Tu contraseña actual es incorrecta.");
      } else {
        setErrorPass("❌ No se pudo cambiar la contraseña.");
      }
    } finally {
      setLoadingPass(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavbarEventia />
        <Container className="flex-fill d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </Container>
        <FooterEventia />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarEventia />

      {/* Fondo suave para la sección de perfil */}
      <div className="flex-fill section-gradient py-5">
        <Container className="d-flex justify-content-center">
          <Card
            className="card-elevated border-0 shadow-lg"
            style={{
              maxWidth: "560px",
              width: "100%",
              borderRadius: "18px",
            }}
          >
            {/* Encabezado */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, #3B1E5A, #5C2A9D 60%, #FFD700)",
                borderTopLeftRadius: "18px",
                borderTopRightRadius: "18px",
                padding: "18px 24px",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <FaUserCircle size={32} />
              <div>
                <h4 className="mb-0 fw-bold">Mi Perfil</h4>
                <small className="text-light">
                  Gestiona tu información personal y seguridad
                </small>
              </div>
            </div>

            <Card.Body className="p-4">
              {/* FOTO */}
              <div className="text-center mb-4">
                <div
                  style={{
                    width: "130px",
                    height: "130px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 12px",
                    border: "3px solid #5C2A9D",
                    position: "relative",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <img
                    src={
                      preview ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="Foto de perfil"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {/* Botón flotante de cámara */}
                  <label
                    htmlFor="avatarInput"
                    style={{
                      position: "absolute",
                      right: 6,
                      bottom: 6,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#5C2A9D",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "2px solid white",
                    }}
                  >
                    <FaCamera color="#fff" size={14} />
                  </label>
                </div>
                <Form.Group controlId="avatarInput" className="mb-0">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Form.Group>
                <small className="text-muted">
                  Formato recomendado: JPG o PNG (máx. 2MB).
                </small>
              </div>

              {/* FORM PERFIL */}
              <div
                className="p-3 mb-4"
                style={{
                  backgroundColor: "#f8f9ff",
                  borderRadius: "12px",
                  border: "1px solid rgba(92,42,157,0.08)",
                }}
              >
                <h6 className="text-primary fw-bold mb-3">Datos personales</h6>

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
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      type="email"
                      value={perfil?.email || ""}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      Tu correo no se puede modificar desde aquí.
                    </Form.Text>
                  </Form.Group>

                  {mensaje && (
                    <Alert variant="success" className="py-2">
                      {mensaje}
                    </Alert>
                  )}
                  {error && (
                    <Alert variant="danger" className="py-2">
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 fw-semibold"
                    disabled={saving}
                  >
                    {saving ? "Guardando cambios..." : "Guardar cambios"}
                  </Button>
                </Form>
              </div>

              {/* CAMBIAR CONTRASEÑA */}
              <div
                className="p-3"
                style={{
                  backgroundColor: "#fff9eb",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,193,7,0.3)",
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <FaLock className="me-2 text-warning" />
                  <h6 className="mb-0 text-warning fw-bold">
                    Cambiar contraseña
                  </h6>
                </div>
                <small className="text-muted d-block mb-3">
                  Te recomendamos usar una contraseña segura que no utilices en
                  otros sitios.
                </small>

                {mensajePass && (
                  <Alert variant="success" className="py-2">
                    {mensajePass}
                  </Alert>
                )}
                {errorPass && (
                  <Alert variant="danger" className="py-2">
                    {errorPass}
                  </Alert>
                )}

                <Form onSubmit={cambiarPassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña actual</Form.Label>
                    <Form.Control
                      type="password"
                      value={passActual}
                      onChange={(e) => setPassActual(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nueva contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={passNueva}
                      onChange={(e) => setPassNueva(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Repetir nueva contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={passRepetir}
                      onChange={(e) => setPassRepetir(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="warning"
                    className="w-100 fw-semibold"
                    disabled={loadingPass}
                  >
                    {loadingPass ? "Actualizando..." : "Cambiar contraseña"}
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>

      <FooterEventia />
    </div>
  );
}

export default Perfil;
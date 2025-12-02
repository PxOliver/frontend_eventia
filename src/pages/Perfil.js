import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
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

  const API_PERFIL = `${API_BASE_URL}/perfil`;
  const API_AVATAR = `${API_BASE_URL}/perfil/avatar`;

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
        console.error("Error al cargar perfil:", err);
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

      // Si hay archivo nuevo, primero subirlo
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

      // Luego actualizar datos de perfil
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
      console.error("Error al actualizar perfil:", err);
      setError("❌ No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarEventia />
      <div className="flex-fill section-gradient py-5">
        <Container className="d-flex justify-content-center">
          <Card
            className="card-elevated p-4 border-0"
            style={{ maxWidth: "480px", width: "100%" }}
          >
            <h3 className="text-center mb-3 page-title text-primary">
              Mi Perfil
            </h3>
            <p className="text-center text-muted mb-4">
              Actualiza tu información personal y tu foto de perfil.
            </p>

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
              <Alert
                variant="danger"
                onClose={() => setError("")}
                dismissible
              >
                {error}
              </Alert>
            )}

            <div className="text-center mb-3">
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto 10px",
                  border: "3px solid #5C2A9D",
                }}
              >
                <img
                  src={
                    preview ||
                    "https://via.placeholder.com/150x150.png?text=Sin+Foto"
                  }
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className="mb-0">Cambiar foto</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              </Form.Group>
            </div>

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

              <Form.Group className="mb-4">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  value={perfil?.email || ""}
                  disabled
                />
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  className="fw-semibold"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </Form>
          </Card>
        </Container>
      </div>
      <FooterEventia />
    </div>
  );
}

export default Perfil;
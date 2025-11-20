import { useState, type FormEvent } from "react";
import "../styles/Form.css";

type Ticket = {
  code: string;
  name: string;
  last: string;
  address: string;
  position: string;
  email: string;
  phone?: string;
  requestType: string;
  otherRequest?: string;
  description: string;
  fileName?: string;
  observations?: string;
  createdAt: string;
};

const requestOptions = [
  "Problemas de hardware (Físico)",
  "Problemas de software (Digital)",
  "Problemas de red / internet",
  "Solicitud de instalación de software (aplicación)",
  "Solicitud de acceso a sistemas",
  "Solicitud de creación / desbloqueo de cuenta",
  "Problemas con impresoras",
  "Problemas con correo electrónico",
  "Solicitud de actualización de aplicación",
  "Otros",
];

function generateTicketCode() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  return `SSTI-${year}-${random}`;
}

export default function Formulario() {
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState(""); // cambiado para mostrar placeholder
  const [otherRequest, setOtherRequest] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [observations, setObservations] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Ticket | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "El Nombre es obligatorio.";
    if (!last.trim()) e.last = "El Apellido es obligatorio.";
    if (!position.trim()) e.position = "Cargo es obligatorio.";
    if (!requestType) e.requestType = "El tipo de requerimiento es obligatorio."; // validación agregada
    if (!description.trim()) e.description = "Descripción del problema es obligatoria.";
    // Simple email regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) e.email = "Formato de correo institucional inválido.";
    if (requestType === "Otros" && !otherRequest.trim()) e.otherRequest = "Por favor especifica el tipo en 'Otros'.";
    if (file) {
      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/gif", "application/pdf"];
      if (!allowed.includes(file.type)) e.file = "Solo se permiten imágenes (png/jpg/gif) o PDF.";
      const maxSize = 8 * 1024 * 1024;
      if (file.size > maxSize) e.file = "El archivo supera 8 MB.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const code = generateTicketCode();
    const ticket: Ticket = {
      code,
      name,
      last,
      address,
      position,
      email,
      phone: phone || undefined,
      requestType,
      otherRequest: requestType === "Otros" ? otherRequest : undefined,
      description,
      fileName: file ? file.name : undefined,
      observations: observations || undefined,
      createdAt: new Date().toISOString(),
    };

    // Simulación: aquí enviarías a tu API
    console.log("Ticket creado:", ticket);
    setSubmitted(ticket);

    try {
      const raw = localStorage.getItem("tickets");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(ticket);
      localStorage.setItem("tickets", JSON.stringify(arr));
    } catch (err) {
      console.warn("No se pudo guardar el ticket en localStorage:", err);
    }

    // Opcional: limpiar formulario
    setName("");
    setLast("");
    setAddress("");
    setPosition("");
    setEmail("");
    setPhone("");
    setRequestType(""); // vuelve al placeholder
    setOtherRequest("");
    setDescription("");
    setFile(null);
    setObservations("");
    setErrors({});
  };

  return (
    <div className="form-container">
      <h2 className="align-center ">REGISTRO DE REQUERIMIENTO TIC</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Nombre *
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Ingrese sus nombres completos" />
          {errors.name && <span className="error">{errors.name}</span>}
        </label>
        <label>
          Apellido *
          <input value={last} onChange={(e) => setLast(e.target.value)} type="text" placeholder="Ingrese sus apellidos completos" />
          {errors.last && <span className="error">{errors.last}</span>}
        </label>
        <label >
          Dirección / Área
          <select value={address} onChange={(e) => setAddress(e.target.value)}>
            <option value="">-- Seleccione un área --</option>
            <option value="Dirección General">Tecnologías De La Información Y Comunicación</option>
            <option value="Área Técnica">Dirección De Información Hidrometeorológica</option>
            <option value="Oficina Administrativa">Dirección De Administración De Recursos Humanos</option>
            <option value="Oficina Administrativa">Dirección Administrativa Financiera</option>
            <option value="Oficina Administrativa">Dirección Ejecutiva</option>
            <option value="Oficina Administrativa">Dirección De Asesoría Jurídica</option>
            <option value="Oficina Administrativa">Dirección De Comunicación Social</option>
            <option value="Oficina Administrativa">Dirección De Planificación</option>
            <option value="Oficina Administrativa">Dirección De Pronósticos Y Alertas</option>
            <option value="Oficina Administrativa">Dirección De Estudios, Investigación Y Desarrollo Hidrometeorológico</option>
            <option value="Oficina Administrativa">Dirección De La Red Nacional De Observación Hidrometeorológica</option>
            <option value="Oficina Administrativa">Laboratorio Nacional De Calidad De Agua Y Sedimentos</option>
            
          </select>
        </label>

        <label>
          Cargo *
          <input value={position} onChange={(e) => setPosition(e.target.value)} type="text"  placeholder="Ingrese su cargo"/>
          {errors.position && <span className="error">{errors.position}</span>}
        </label>

        <label>
          Correo institucional *
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Ingrese su correo electronico" />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>

        <label>
          Teléfono / Extensión
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Ingrese su numero telefonico"/>
        </label>

        <label>
          Tipo de requerimiento *
          <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
            <option value="">-- Seleccione un requerimiento --</option>
            {requestOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.requestType && <span className="error">{errors.requestType}</span>}
        </label>

        {requestType === "Otros" && (
          <label className="form-full">
            Especifique (Otros) *
            <input value={otherRequest} onChange={(e) => setOtherRequest(e.target.value)} type="text" placeholder="Especifique su requerimento" />
            {errors.otherRequest && <span className="error">{errors.otherRequest}</span>}
          </label>
        )}

        <label className="form-full">
          Descripción del problema *
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Ingrese la descripcion de su problema" />
          {errors.description && <span className="error">{errors.description}</span>}
        </label>

        <label>
          Adjuntar evidencia (opcional)
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              setFile(f || null);
            }}
          />
          {errors.file && <span className="error">{errors.file}</span>}
          <small className="note">Se permiten imágenes y PDF. Tamaño máximo 8 MB.</small>
        </label>

        <label>
          Observaciones adicionales
          <input value={observations} onChange={(e) => setObservations(e.target.value)} type="text" placeholder="Ingrese observaciones adicionales (opcional)"/>
        </label>

        <div className="actions form-full">
          <button type="submit" className="submit-btn">Enviar requerimiento</button>
        </div>
      </form>

      {submitted && (
        <div className="ticket-summary">
          <h3>Ticket generado</h3>
          <p>
            <strong>Código:</strong> {submitted.code}
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(submitted.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Solicitante:</strong> {submitted.name} — {submitted.position}
          </p>
          <p>
            <strong>Tipo:</strong> {submitted.requestType}
            {submitted.otherRequest ? ` — ${submitted.otherRequest}` : ""}
          </p>
          <p>
            <strong>Descripción:</strong> {submitted.description}
          </p>
          {submitted.fileName && (
            <p>
              <strong>Archivo adjunto:</strong> {submitted.fileName}
            </p>
          )}
          <p className="success">Ticket creado exitosamente! Por favor no olvidar su codigo de Ticket para ver su estado.</p>
        </div>
      )}
    </div>
  );
}

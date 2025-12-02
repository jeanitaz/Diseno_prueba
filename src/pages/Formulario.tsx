import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Formulario.css'; // Asegúrate de que este archivo incluya los nuevos estilos abajo
import logoInamhi from '../assets/lgo.png';

// ... (MANTENER LOS ARRAYS DE AREAS Y TIPOS IGUAL QUE ANTES) ...
const AREAS_INSTITUCIONALES = [
    "Dirección Ejecutiva", "Coordinación General Técnica", "Dirección de Meteorología",
    "Dirección de Hidrología", "Dirección Administrativa Financiera", "Gestión de Tecnologías (TIC)",
    "Jurídico", "Comunicación Social", "Planificación"
];

const TIPOS_REQUERIMIENTO = [
    "Problemas de hardware (Físico)", "Problemas de software (Digital)", "Problemas de red / internet",
    "Solicitud de instalación de software", "Solicitud de acceso a sistemas", "Solicitud de creación / desbloqueo de cuenta",
    "Problemas con impresoras", "Problemas con correo electrónico", "Solicitud de actualización de aplicación", "Otros"
];

// ... (MANTENER LOS ICONOS IGUALES) ...
const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
);
const CheckIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);



const ServiceRequestForm = () => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        fullName: '', area: '', position: '', email: '', 
        phone: '', reqType: '', otherDetail: '', description: '', observations: ''
    });

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    // ... (MANTENER HANDLECHANGE Y HANDLEFILECHANGE IGUAL) ...
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    };

    const generateTicketID = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(6, '0');
        return `SSTI-${year}-${randomNum}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación rápida (opcional)
    if (!formData.email.includes('@inamhi.gob.ec')) {
        alert('Correo inválido');
        setLoading(false);
        return;
    }

    // Simulación de proceso
    setTimeout(() => {
        const newTicket = generateTicketID();
        setTicketId(newTicket); // Guardamos el ID
        setLoading(false);      // Quitamos el spinner
        setShowModal(true);     // <--- ¡AQUÍ SE ABRE EL MODAL!
    }, 1500);
};

    

    // --- RENDER ---
    return (
        <div className="form-container">
            <div className="stars"></div>
            
            <div className="form-wrapper glass-panel animate-slide-up">
                {/* Header del Formulario */}
                <div className="form-header">
                    <Link to="/" className="back-link"><BackIcon /> Cancelar</Link>
                    <img src={logoInamhi} alt="Logo" className="form-logo" />
                    <h2>Nueva Solicitud de Soporte</h2>
                    <p>Complete los campos para registrar su incidencia</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* ... (TODO EL CONTENIDO DEL FORMULARIO SE MANTIENE EXACTAMENTE IGUAL) ... */}
                    {/* ... (Solo estoy omitiendo el código repetitivo de inputs para ahorrar espacio, pégalos aquí) ... */}
                    
                    {/* SECCIÓN 1: DATOS DEL USUARIO */}
                    <div className="form-section">
                        <h3><span className="step-number">1</span> Información del Solicitante</h3>
                        <div className="grid-2">
                            <div className="input-group">
                                <label>Nombre Completo *</label>
                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Cargo *</label>
                                <input type="text" name="position" required value={formData.position} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="grid-2">
                             <div className="input-group">
                                <label>Dirección / Área *</label>
                                <select name="area" required value={formData.area} onChange={handleChange}>
                                    <option value="">Seleccione un área...</option>
                                    {AREAS_INSTITUCIONALES.map(area => <option key={area} value={area}>{area}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Correo Institucional *</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                            </div>
                        </div>
                         <div className="input-group">
                            <label>Teléfono (Opcional)</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="divider"></div>

                    {/* SECCIÓN 2: DETALLE */}
                    <div className="form-section">
                        <h3><span className="step-number">2</span> Detalle del Requerimiento</h3>
                        <div className="input-group">
                            <label>Tipo de Requerimiento *</label>
                            <select name="reqType" required value={formData.reqType} onChange={handleChange}>
                                <option value="">Seleccione...</option>
                                {TIPOS_REQUERIMIENTO.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        {formData.reqType === 'Otros' && (
                             <div className="input-group animate-fade-in">
                                <label>Especifique *</label>
                                <input type="text" name="otherDetail" required value={formData.otherDetail} onChange={handleChange} />
                            </div>
                        )}
                        <div className="input-group">
                            <label>Descripción *</label>
                            <textarea name="description" rows={4} required value={formData.description} onChange={handleChange}></textarea>
                        </div>
                        <div className="input-group">
                            <label>Adjuntar Evidencia</label>
                            <div className="file-drop-zone" onClick={() => fileInputRef.current?.click()}>
                                <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf"/>
                                <div className="file-content">
                                    <UploadIcon />
                                    <span>{file ? file.name : "Click para subir imagen o PDF"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Observaciones</label>
                            <input type="text" name="observations" value={formData.observations} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-glow full-width" disabled={loading}>
                            {loading ? <span className="spinner"></span> : 'Generar Ticket'}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- ESTE ES EL MODAL --- */}
{showModal && (
    <div className="modal-overlay animate-fade-in">
        <div className="modal-content animate-pop-in">
            <div className="modal-header">
                <CheckIcon />
                <h2>¡Solicitud Enviada!</h2>
            </div>
            
            <div className="ticket-display">
                <span className="ticket-label">TICKET GENERADO</span>
                <span className="ticket-number">{ticketId}</span>
            </div>

            <div className="modal-summary">
                <p><strong>Solicitante:</strong> {formData.fullName}</p>
                <p><strong>Área:</strong> {formData.area}</p>
                <p><strong>Problema:</strong> {formData.reqType}</p>
            </div>

            <p className="modal-note">
                Hemos enviado los detalles a su correo: {formData.email}
            </p>

            {/* Botón para cerrar el modal y limpiar */}
            <button 
                className="btn-glow" 
                onClick={() => {
                    setShowModal(false); // Cierra el modal
                    setTicketId(null);
                    setFormData({
                        fullName: '', area: '', position: '', email: '', 
                        phone: '', reqType: '', otherDetail: '', description: '', observations: ''
                    });
                    setFile(null);
                }}
            >
                Entendido, gracias
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default ServiceRequestForm;
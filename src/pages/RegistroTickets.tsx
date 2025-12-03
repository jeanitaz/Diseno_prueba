import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegistroTickects.css';
import logoInamhi from '../assets/lgo.png';

// --- ICONOS ---
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
);

interface Ticket {
    id_visual: string;
    estado: string;
    nombre_completo: string;
    area: string;
    date: string;
    fecha_creacion: string;
    tipo: string;
    descripcion_problema: string;
}

const TicketTracking = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setTicket(null);
        setError('');

        try {
            // CONEXIÓN CON EL BACKEND
            const response = await fetch(`http://localhost:3001/api/tickets/search?term=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            if (response.ok) {
                // Formateamos la fecha para que se vea bonita
                const formattedTicket = {
                    ...data,
                    date: new Date(data.fecha_creacion).toLocaleDateString('es-EC')
                };
                setTicket(formattedTicket);
            } else {
                setError(data.message || 'No se encontró el ticket.');
            }
        } catch (err) {
            console.error("Error buscando ticket:", err);
            setError('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        // Aseguramos que status exista antes de comparar
        const s = status ? status.toLowerCase() : '';
        if (s === 'resuelto') return 'status-success';
        if (s === 'en proceso') return 'status-warning';
        return 'status-pending';
    };

    return (
        <div className="form-container">
            <div className="stars"></div>

            <div className="form-wrapper glass-panel animate-slide-up" style={{ maxWidth: '600px' }}>
                <div className="form-header">
                    <Link to="/" className="back-link"><BackIcon /> Volver al Inicio</Link>
                    <img src={logoInamhi} alt="Logo" className="form-logo" />
                    <h2>Consultar Estado</h2>
                    <p>Ingrese su número de ticket (Ej: SSTI-2025-0001) o nombre completo</p>
                </div>

                {/* BARRA DE BÚSQUEDA */}
                <form onSubmit={handleSearch} className="search-box-container">
                    <div className="search-input-wrapper">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Ej: SSTI-2025-0001 o Juan Pérez..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-glow" disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Buscar'}
                    </button>
                </form>

                <div className="divider"></div>

                {/* RESULTADOS */}
                <div className="result-area">
                    {loading && <p className="loading-text">Consultando base de datos...</p>}

                    {error && (
                        <div className="error-message animate-fade-in">
                            ⚠️ {error}
                        </div>
                    )}

                    {ticket && (
                        <div className="ticket-card animate-pop-in">
                            <div className="ticket-card-header">
                                <span className="ticket-id-badge">{ticket.id_visual}</span>
                                <span className={`status-badge ${getStatusColor(ticket.estado)}`}>
                                    {ticket.estado}
                                </span>
                            </div>

                            <div className="ticket-details">
                                <div className="detail-row">
                                    <span className="label">Solicitante:</span>
                                    <span className="value">{ticket.nombre_completo}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Área:</span>
                                    <span className="value">{ticket.area}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Fecha:</span>
                                    <span className="value">{ticket.date}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Tipo:</span>
                                    <span className="value">{ticket.tipo}</span>
                                </div>
                            </div>

                            <div className="ticket-description">
                                <span className="label">Descripción:</span>
                                <p>{ticket.descripcion_problema}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketTracking;
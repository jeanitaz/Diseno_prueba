import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RegistroTickects.css'; // Importamos los estilos específicos
import logoInamhi from '../assets/lgo.png';

// --- TIPO DE TICKET (Solo para TypeScript) ---
interface Ticket {
    id: string;
    name: string;
    area: string;
    type: string;
    status: string;
    date: string;
    description: string;
}

// --- BASE DE DATOS SIMULADA (MOCK DATA) ---
const MOCK_DB: Ticket[] = [
    {
        id: "SSTI-2024-8842",
        name: "Carlos Estévez",
        area: "Dirección de Meteorología",
        type: "Problemas de red / internet",
        status: "Pendiente",
        date: "2024-10-25",
        description: "No tengo acceso a la carpeta compartida de lluvias."
    },
    {
        id: "SSTI-2024-1002",
        name: "Maria Fernanda",
        area: "Jurídico",
        type: "Problemas de hardware",
        status: "En Proceso",
        date: "2024-10-24",
        description: "La impresora hace un ruido extraño al imprimir a doble cara."
    },
    {
        id: "SSTI-2024-0011",
        name: "Juan Perez",
        area: "Tecnología",
        type: "Instalación de Software",
        status: "Resuelto",
        date: "2024-10-20",
        description: "Instalación de Adobe Acrobat Pro completada."
    }
];

// --- ICONOS ---
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
);

const TicketTracking = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setLoading(true);
        setTicket(null);
        setError('');

        // Simulamos retardo de red
        setTimeout(() => {
            const found = MOCK_DB.find(t =>
                t.id.toLowerCase() === searchTerm.toLowerCase() ||
                t.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (found) {
                setTicket(found);
            } else {
                setError('No se encontró ningún ticket con esa información.');
            }
            setLoading(false);
        }, 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Resuelto': return 'status-success';
            case 'En Proceso': return 'status-warning';
            default: return 'status-pending';
        }
    };

    return (
        <div className="form-container">
            <div className="stars"></div>

            <div className="form-wrapper glass-panel animate-slide-up" style={{ maxWidth: '600px' }}>
                <div className="form-header">
                    <Link to="/" className="back-link"><BackIcon /> Volver al Inicio</Link>
                    <img src={logoInamhi} alt="Logo" className="form-logo" />
                    <h2>Consultar Estado</h2>
                    <p>Ingrese su número de ticket o nombre completo</p>
                </div>

                {/* BARRA DE BÚSQUEDA */}
                <form onSubmit={handleSearch} className="search-box-container">
                    <div className="search-input-wrapper">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Ej: SSTI-2024-8842 o Carlos..."
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
                    {loading && <p className="loading-text">Buscando en la base de datos...</p>}

                    {error && (
                        <div className="error-message animate-fade-in">
                            ⚠️ {error}
                        </div>
                    )}

                    {ticket && (
                        <div className="ticket-card animate-pop-in">
                            <div className="ticket-card-header">
                                <span className="ticket-id-badge">{ticket.id}</span>
                                <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                            </div>

                            <div className="ticket-details">
                                <div className="detail-row">
                                    <span className="label">Solicitante:</span>
                                    <span className="value">{ticket.name}</span>
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
                                    <span className="value">{ticket.type}</span>
                                </div>
                            </div>

                            <div className="ticket-description">
                                <span className="label">Descripción:</span>
                                <p>{ticket.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketTracking;
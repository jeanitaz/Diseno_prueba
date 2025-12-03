import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Reloj from "../components/reloj"; // Descomenta si tienes el componente
import logoInamhi from '../assets/lgo.png';
import "../styles/Tecnico.css"; // Usaremos el CSS que me pasaste + extras

// --- MOCK DATA (Datos de prueba) ---
const INITIAL_TICKETS = [
    { id: "TIC-001", issue: "Falla Impresora Laser", area: "RRHH", prio: "Alta", estado: "Pendiente", asignado: null, fecha: "2025-12-02", desc: "No jala papel y hace ruido." },
    { id: "TIC-002", issue: "Instalar Office 365", area: "Financiero", prio: "Media", estado: "En proceso", asignado: "YO", fecha: "2025-12-03", desc: "Requiere licencia para nuevo ingreso." },
    { id: "TIC-003", issue: "Sin acceso a Internet", area: "Gerencia", prio: "Alta", estado: "En proceso", asignado: "YO", fecha: "2025-12-03", desc: "Router parpadea en rojo." },
    { id: "TIC-004", issue: "Cambio de Mouse", area: "Bodega", prio: "Baja", estado: "Resuelto", asignado: "YO", fecha: "2025-11-20", desc: "El click derecho no funciona." },
    { id: "TIC-005", issue: "PC Lenta", area: "Recepción", prio: "Media", estado: "Pendiente", asignado: null, fecha: "2025-12-04", desc: "Se congela al abrir Excel." },
];

// --- COMPONENTE KPI (Reutilizado) ---
interface StatusCardProps {
    title: string;
    icon: string;
    count: number;
    colorClass: string;
}

const StatusCard = ({ title, icon, count, colorClass }: StatusCardProps) => (
    <div className={`kpi-card ${colorClass}`}>
        <div className="kpi-icon-wrapper">{icon}</div>
        <div className="kpi-info">
            <span className="kpi-count">{count}</span>
            <span className="kpi-title">{title}</span>
        </div>
    </div>
);

export default function TechnicianDashboard() {
    const navigate = useNavigate();
    const [seccion, setSeccion] = useState("mis-pendientes"); // 'bolsa', 'mis-pendientes', 'historial'
    const [tickets, setTickets] = useState(INITIAL_TICKETS);

    // --- LÓGICA DE FILTRADO ---
    const ticketsFiltrados = tickets.filter(t => {
        if (seccion === "bolsa") return t.asignado === null;
        if (seccion === "mis-pendientes") return t.asignado === "YO" && t.estado !== "Resuelto";
        if (seccion === "historial") return t.asignado === "YO" && t.estado === "Resuelto";
        return [];
    });

    // --- ACCIONES ---
    const tomarTicket = (id: string) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, asignado: "YO", estado: "En proceso" } : t));
        setSeccion("mis-pendientes"); // Mover al técnico a su lista automáticamente
    };

    const finalizarTicket = (id: string) => {
        if (window.confirm("¿Marcar ticket como resuelto?")) {
            setTickets(tickets.map(t => t.id === id ? { ...t, estado: "Resuelto" } : t));
        }
    };

    const handleLogout = () => navigate('/login');

    return (
        <div className="admin-layout">
            {/* FONDO ANIMADO */}
            <div className="admin-bg-stars"></div>
            <div className="admin-bg-glow"></div>

            {/* --- SIDEBAR (Adaptado para Técnico) --- */}
            <aside className="glass-sidebar">
                <div className="sidebar-header">
                    <img src={logoInamhi} alt="Logo INAMHI" className="sidebar-logo" />
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <span className="nav-label">Mi Espacio</span>

                        <button
                            className={`nav-item ${seccion === 'mis-pendientes' ? 'active' : ''}`}
                            onClick={() => setSeccion('mis-pendientes')}
                        >
                            <span className="icon">🚀</span> En Curso
                            <span className="badge-pill">{tickets.filter(t => t.asignado === "YO" && t.estado !== "Resuelto").length}</span>
                        </button>

                        <button
                            className={`nav-item ${seccion === 'bolsa' ? 'active' : ''}`}
                            onClick={() => setSeccion('bolsa')}
                        >
                            <span className="icon">📥</span> Bolsa de Tickets
                            <span className="badge-pill warning">{tickets.filter(t => t.asignado === null).length}</span>
                        </button>

                        <button
                            className={`nav-item ${seccion === 'historial' ? 'active' : ''}`}
                            onClick={() => setSeccion('historial')}
                        >
                            <span className="icon">✅</span> Historial
                        </button>
                    </div>

                    <div className="nav-group">
                        <span className="nav-label">Sistema</span>
                        <button className="nav-item logout" onClick={handleLogout}>
                            <span className="icon">🚪</span> Salir
                        </button>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-mini-profile">
                        <div className="user-avatar">TEC</div>
                        <div className="user-info">
                            <span className="name">Técnico 1</span>
                            <span className="role">Soporte N1</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="admin-content">

                {/* Header */}
                <header className="content-header">
                    <div className="header-titles">
                        <h1>Panel Técnico</h1>
                        <p>
                            {seccion === 'bolsa' && "Tickets disponibles para tomar."}
                            {seccion === 'mis-pendientes' && "Tus asignaciones activas."}
                            {seccion === 'historial' && "Tickets que has resuelto."}
                        </p>
                    </div>
                    {/* <Reloj /> */}
                    <div className="date-badge">{new Date().toLocaleDateString()}</div>
                </header>

                {/* KPIs Rápidos (Siempre visibles) */}
                <div className="kpi-mini-grid">
                    <StatusCard title="Pendientes" count={tickets.filter(t => t.asignado === "YO" && t.estado !== "Resuelto").length} icon="🔥" colorClass="warning" />
                    <StatusCard title="Resueltos Hoy" count={2} icon="✨" colorClass="success" />
                    <StatusCard title="Bolsa General" count={tickets.filter(t => t.asignado === null).length} icon="📢" colorClass="info" />
                </div>

                {/* --- GRID DE TICKETS (Glass Cards) --- */}
                <div className="tickets-grid-container">
                    {ticketsFiltrados.length > 0 ? (
                        ticketsFiltrados.map((t) => (
                            <div key={t.id} className={`glass-ticket-card priority-${t.prio.toLowerCase()}`}>
                                <div className="ticket-header">
                                    <span className="ticket-id">#{t.id}</span>
                                    <span className={`status-badge ${t.estado === 'Resuelto' ? 'done' : 'pending'}`}>{t.estado}</span>
                                </div>

                                <div className="ticket-body">
                                    <h3>{t.issue}</h3>
                                    <p className="desc">"{t.desc}"</p>

                                    <div className="ticket-meta">
                                        <div className="meta-item">
                                            <span className="label">Área:</span> {t.area}
                                        </div>
                                        <div className="meta-item">
                                            <span className="label">Prioridad:</span>
                                            <span className={`prio-text ${t.prio.toLowerCase()}`}>{t.prio}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ticket-footer">
                                    {seccion === 'bolsa' && (
                                        <button className="btn-neon full-width" onClick={() => tomarTicket(t.id)}>
                                            ✋ Tomar Ticket
                                        </button>
                                    )}
                                    {seccion === 'mis-pendientes' && (
                                        <>
                                            <button className="btn-glass">📝 Bitácora</button>
                                            <button className="btn-neon-green" onClick={() => finalizarTicket(t.id)}>✅ Finalizar</button>
                                        </>
                                    )}
                                    {seccion === 'historial' && (
                                        <button className="btn-glass full-width">👁️ Ver Detalles</button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state-glass">
                            <span className="empty-icon">📂</span>
                            <p>No hay tickets en esta sección.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
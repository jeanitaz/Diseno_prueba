import { useNavigate } from "react-router-dom";
import Reloj from "../components/reloj";
import logoInamhi from '../assets/lgo.png';
import "../styles/Admin.css";

// --- COMPONENTE DE TARJETA DE ESTADO (KPI) ---
const StatusCard = ({ title, icon, status, count = 0 }: { title: string; icon: string; status: string; count?: number }) => {
    return (
        <div className={`kpi-card ${status}`}>
            <div className="kpi-icon-wrapper">
                {icon}
            </div>
            <div className="kpi-info">
                <span className="kpi-count">{count}</span>
                <span className="kpi-title">{title}</span>
            </div>
            <div className="kpi-glow"></div>
        </div>
    );
};

export default function Admin() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Lógica de limpieza de sesión
        navigate('/');
    };

    return (
        <div className="admin-layout">
            {/* --- FONDO ANIMADO --- */}
            <div className="admin-bg-stars"></div>
            <div className="admin-bg-glow"></div>

            {/* --- SIDEBAR DE NAVEGACIÓN --- */}
            <aside className="glass-sidebar">
                <div className="sidebar-header">
                    <img src={logoInamhi} alt="Logo INAMHI" className="sidebar-logo" />
                </div>
                
                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <span className="nav-label">Principal</span>
                        <button className="nav-item active">
                            <span className="icon">📊</span> Dashboard
                        </button>
                        <button className="nav-item" onClick={() => navigate('/reportes')}>
                            <span className="icon">📈</span> Estadísticas
                        </button>
                    </div>

                    <div className="nav-group">
                        <span className="nav-label">Gestión</span>
                        <button className="nav-item" onClick={() => navigate('/listado')}>
                            <span className="icon">📝</span> Historial Tickets
                        </button>
                        <button className="nav-item">
                            <span className="icon">👥</span> Usuarios
                        </button>
                    </div>

                    <div className="nav-group">
                        <span className="nav-label">Sistema</span>
                        <button className="nav-item">
                            <span className="icon">⚙️</span> Configuración
                        </button>
                        <button className="nav-item logout" onClick={handleLogout}>
                            <span className="icon">🚪</span> Salir
                        </button>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-mini-profile">
                        <div className="user-avatar">DG</div>
                        <div className="user-info">
                            <span className="name">Diego G.</span>
                            <span className="role">Admin</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="admin-content">
                
                {/* Header Superior */}
                <header className="content-header">
                    <div className="header-titles">
                        <h1>Panel de Control</h1>
                        <p>Visión general del sistema de soporte</p>
                    </div>
                    <div className="header-actions">
                         <Reloj />
                    </div>
                </header>

                {/* Grid del Dashboard */}
                <div className="dashboard-grid">
                    
                    {/* Tarjeta de Bienvenida (Hero) */}
                    <div className="hero-card glass-panel">
                        <div className="hero-text">
                            <h2>¡Hola de nuevo, Diego! 👋</h2>
                            <p>Tienes <strong>5 tickets pendientes</strong> que requieren tu atención hoy. El sistema funciona con normalidad.</p>
                            <button onClick={() => navigate('/listado')} className="btn-neon">
                                Ver Tickets Pendientes
                            </button>
                        </div>
                        <div className="hero-visual">
                           {/* Elemento decorativo visual */}
                           <div className="pulse-circle"></div>
                        </div>
                    </div>

                    {/* KPIs / Métricas */}
                    <div className="kpi-section">
                        <StatusCard title="Aprobados" icon="✅" status="success" count={12} />
                        <StatusCard title="Rechazados" icon="⛔" status="danger" count={3} />
                        <StatusCard title="Pendientes" icon="⏳" status="warning" count={5} />
                        <StatusCard title="Total Mes" icon="📁" status="info" count={48} />
                    </div>

                    {/* Gráficos y Tablas (Placeholders estilizados) */}
                    <div className="chart-card glass-panel span-2">
                        <div className="card-header">
                            <h3>Rendimiento Mensual</h3>
                            <button className="btn-sm">Exportar</button>
                        </div>
                        <div className="chart-area">
                            {/* Aquí iría tu librería de gráficos (Recharts, ChartJS) */}
                            <div className="fake-chart-bars">
                                <div className="bar" style={{height: '40%'}}></div>
                                <div className="bar" style={{height: '70%'}}></div>
                                <div className="bar active" style={{height: '55%'}}></div>
                                <div className="bar" style={{height: '85%'}}></div>
                                <div className="bar" style={{height: '60%'}}></div>
                                <div className="bar" style={{height: '45%'}}></div>
                                <div className="bar" style={{height: '90%'}}></div>
                            </div>
                            <div className="chart-label">Tickets generados por día</div>
                        </div>
                    </div>

                    <div className="stat-card glass-panel">
                        <h3>Eficacia de Resolución</h3>
                        <div className="circular-progress">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="percentage">85%</div>
                        </div>
                        <p className="stat-detail">Alta eficiencia esta semana</p>
                    </div>

                </div>
            </main>
        </div>
    );
}
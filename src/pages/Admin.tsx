
import "../styles/Admin.css";
import logoInamhi from '../assets/lgo.png';
import Reloj from "../components/reloj";
import { useNavigate } from "react-router-dom";

// Actualizamos el componente para soportar el nuevo diseño de KPI
const StatusCard = ({ title, icon, status, count = 0 }: { title: string; icon: string; status: string; count?: number }) => {
    return (
        <div className={`status-card ${status}`}>
            <div className="status-content">
                <span className="status-title">{title}</span>
                <span className="status-count">{count}</span>
            </div>
            <div className="status-icon-box">
                {icon}
            </div>
        </div>
    );
};

export default function Admin() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Optional: Clear any stored authentication data
        // localStorage.removeItem('authToken');
        // sessionStorage.clear();

        // Navigate to login page
        navigate('/login');
    };
    return (
        <div className="admin-root">
            {/* Sidebar Oscuro */}
            <aside className="admin-sidebar">
                <img src={logoInamhi} alt="Logo INAMHI" />
                <nav className="side-nav">
                    <div className="section">Principal</div>
                    <a className="active">Dashboard</a>
                    <a>Estadísticas</a>

                    <div className="section">Gestión</div>
                    <a href="/listado">Historial de Tickets</a>
                    <a>Usuarios Registrados</a>

                    <div className="section">Configuración</div>
                    <a>Perfil</a>
                    <a>Seguridad</a>
                </nav>
            </aside>

            {/* Contenido Principal */}
            <main className="admin-main">
                <header className="topbar">
                    <div>
                        {/* Espacio para breadcrumbs o título si deseas */}
                    </div>
                    <div className="top-actions">
                        <div className="avatar">DG</div>
                        <button onClick={handleLogout} className="logout-btn">
                            Cerrar Sesión
                        </button>
                    </div>
                </header>
                <section className="page-grid">
                    {/* Hero Banner */}
                    <div className="hero card">
                        <div className="hero-left">
                            <h3>¡Bienvenido, Diego Gonzalez!</h3>
                            <p>Aquí tienes un resumen general de la actividad del sistema hoy.</p>
                            <button onClick={() => navigate('/reportes')} className="btn-primary">Ver Reportes</button>
                        </div>
                        <div className="hero-right">
                            📊
                        </div>
                    </div>
                    <Reloj />
                    {/* Tarjetas de Estado (KPIs) */}
                    <div className="ticket-status-wrapper">
                        <h3 className="ticket-status-title">Resumen de Tickets</h3>
                        <div className="status-cards">
                            {/* Usamos datos simulados (count) para el ejemplo visual */}
                            <StatusCard title="Aprobados" icon="✔️" status="approved" count={12} />
                            <StatusCard title="Rechazados" icon="❌" status="rejected" count={3} />
                            <StatusCard title="Pendientes" icon="⏳" status="pending" count={5} />
                            <StatusCard title="Finalizados" icon="📁" status="finished" count={28} />
                        </div>
                    </div>

                    {/* Gráfico Principal (Simulado) */}
                    <div className="card revenue">
                        <h4>Total Tickets Generados</h4>
                        <div className="chart-placeholder">
                            <span className="chart-number">{ }</span>
                            <small>Tickets Totales</small>
                        </div>
                    </div>

                    {/* Tarjeta Secundaria */}
                    <div className="card orders">
                        <h4>Estadísticas Mensuales</h4>
                        <div className="orders-body">
                            <div className="big-number">8,258</div>
                            <div className="mini-chart">+12.5% vs mes anterior</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
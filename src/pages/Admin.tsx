import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Admin.css";

const StatusCard = ({ title, icon, status }: { title: string; icon: string; status: string }) => {
  return (
    <div className={`status-card glass ${status}`}>
      <div className="status-icon">{icon}</div>
      <h4>{title}</h4>
    </div>
  );
};

export default function Admin() {
    const [ticketCount, setTicketCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/adminlogin');
            return;
        }

        try {
            const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
            setTicketCount(Array.isArray(tickets) ? tickets.length : 0);
        } catch {
            setTicketCount(0);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/adminlogin');
    };

    return (
        <div className="admin-root">
            <aside className="admin-sidebar">
                <img src="../src/assets/lgo.png" alt="Logo INAMHI" />
                <nav className="side-nav">
                    <div className="section">Paginas</div>
                    <a>Account Settings</a>
                    <a>Authentications</a>
                    <div className="section">Components</div>
                    <a>Cards</a>
                    <a>User Interface</a>
                    <div className="section">Tablas y Registro de Usuarios</div>
                    <a>Registro de Usuarios</a>
                    <a href="/listado">Historial</a>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="topbar">
                    <div className="top-actions">
                        <button onClick={handleLogout} className="logout-btn">
                            Cerrar Sesión
                        </button>
                        <div className="avatar">DG</div>
                    </div>
                </header>

                <section className="page-grid">
                    <div className="hero card">
                        <div className="hero-left">
                            <h3>Bienvenido de nuevo Diego Gonzalez!</h3>
                            <br />
                            <p>En este administrador encontraras las estadisticas del sistema de gestion</p>
                            <br />
                            <button className="btn-primary">View Badges</button>
                        </div>
                        <div className="hero-right">
                            <div className="avatar-hero">👨‍💻</div>
                        </div>
                    </div>

                    <div className="card revenue">
                        <h4>Total Conteo de Tickets</h4>
                        <div className="chart-placeholder">
                            <span>{ticketCount}</span>
                        </div>
                    </div>

                    <div className="ticket-status-wrapper">
                        <h3 className="ticket-status-title">Estado de los Tickets</h3>
                        <div className="card status-cards glass">
                            <StatusCard title="Aprobado" icon="✔️" status="approved" />
                            <StatusCard title="Rechazado" icon="❌" status="rejected" />
                            <StatusCard title="Pendiente" icon="⏳" status="pending" />
                            <StatusCard title="Finalizado" icon="📁" status="finished" />
                        </div>
                    </div>

                    <div className="card orders">
                        <h4>Order Statistics</h4>
                        <div className="orders-body">
                            <div className="big-number">8,258</div>
                            <div className="mini-chart">[Mini chart]</div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
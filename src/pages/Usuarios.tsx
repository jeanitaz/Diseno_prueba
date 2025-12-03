import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Formulario.css';
import logoInamhi from '../assets/lgo.png';
import Reloj from '../components/reloj';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Validación básica de seguridad
        const role = localStorage.getItem('role');
        const user = localStorage.getItem('userName');
        
        if (role !== 'admin') {
            navigate('/login'); // Si no es admin, fuera
        } else {
            setUserName(user || 'Diego');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="form-container" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
            <div className="stars"></div>
            
            {/* Header Superior */}
            <nav style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', 
                padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', 
                alignItems: 'center', zIndex: 10, color: 'white' 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={logoInamhi} alt="Logo" style={{ height: '40px' }} />
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Panel Directivo</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>Hola, {userName}</span>
                    <button 
                        onClick={handleLogout}
                        className="btn-glow" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'rgba(255,0,0,0.2)' }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </nav>
            <div className="header-actions">
                <Reloj />
            </div>

            <div className="form-wrapper glass-panel animate-slide-up" style={{ maxWidth: '800px', marginTop: '80px' }}>
                <div className="form-header">
                    <h2>Dashboard General</h2>
                    <p>Vista de Supervisión y Métricas</p>
                </div>

                <div className="grid-2" style={{ gap: '1rem', marginTop: '2rem' }}>
                    {/* Tarjeta de Métricas 1 */}
                    <div style={{ 
                        background: 'rgba(255,255,255,0.1)', padding: '1.5rem', 
                        borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' 
                    }}>
                        <h3 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', color: '#4ade80' }}>12</h3>
                        <span style={{ color: '#94a3b8' }}>Tickets Pendientes</span>
                    </div>

                    {/* Tarjeta de Métricas 2 */}
                    <div style={{ 
                        background: 'rgba(255,255,255,0.1)', padding: '1.5rem', 
                        borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' 
                    }}>
                        <h3 style={{ fontSize: '3rem', margin: '0 0 0.5rem 0', color: '#60a5fa' }}>45</h3>
                        <span style={{ color: '#94a3b8' }}>Tickets Resueltos (Mes)</span>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Gestión de Personal</h3>
                    <p style={{ color: '#cbd5e1' }}>Aquí iría la lista de técnicos y asignaciones...</p>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginAdmin.css';
import logoInamhi from '../assets/lgo.png';

// ... (MANTENER LOS ICONOS IGUAL QUE ANTES: AdminIcon, TechIcon, BackIcon) ...
const AdminIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 6v6l4 2" /></svg>
);
const TechIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
);
const BackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
);

type Role = 'admin' | 'tecnico';

// Datos quemados para prueba
const MOCK_DB = {
    admin: { email: 'admin@inamhi.gob.ec', pass: 'admin123', name: 'Diego González' },
    tecnico: { email: 'tec@inamhi.gob.ec', pass: 'tec123', name: 'Juan Pérez' }
};

const LoginAdmin = () => {
    const [role, setRole] = useState<Role>('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const validUser = MOCK_DB[role];
            
            // Validamos credenciales
            if (email === validUser.email && password === validUser.pass) {
                // Guardamos sesión
                localStorage.setItem('token', 'token-simulado-xyz');
                localStorage.setItem('role', role);
                localStorage.setItem('userName', validUser.name);

                // --- AQUÍ ESTÁ EL CAMBIO DE LÓGICA ---
                if (role === 'admin') {
                    navigate('/super-admin'); // Vista del Jefe / Super Admin
                } else {
                    navigate('/admin'); // Vista del Técnico (Gestión de tickets)
                }

            } else {
                setError('Credenciales no válidas');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className={`login-universe ${role}`}>
            <div className="stars"></div>
            <div className="twinkling"></div>

            <div className="glass-panel animate-pop-in">
                
                <div className="panel-navigation">
                    <Link to="/" className="btn-back">
                        <BackIcon /> <span>Volver al Inicio</span>
                    </Link>
                </div>

                <div className="panel-header">
                    <div className="logo-badge">
                        <img src={logoInamhi} alt="Logo INAMHI" />
                    </div>
                    <h2>Portal de Servicios</h2>
                    <p>Seleccione su perfil para continuar</p>
                </div>

                {/* Selector de Roles */}
                <div className="role-cards">
                    <div
                        className={`role-card ${role === 'admin' ? 'active' : ''}`}
                        onClick={() => { setRole('admin'); setError(''); }}
                    >
                        <div className="icon-box"><AdminIcon /></div>
                        <span>Super Admin</span>
                    </div>
                    <div
                        className={`role-card ${role === 'tecnico' ? 'active' : ''}`}
                        onClick={() => { setRole('tecnico'); setError(''); }}
                    >
                        <div className="icon-box"><TechIcon /></div>
                        <span>Técnico</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-field">
                        <input
                            type="email"
                            placeholder=" "
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Correo Institucional</label>
                    </div>

                    <div className="input-field">
                        <input
                            type="password"
                            placeholder=" "
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Contraseña</label>
                    </div>

                    {error && <div className="error-pill">⚠️ {error}</div>}

                    <button type="submit" className="btn-glow" disabled={loading}>
                        {loading ? 'Autenticando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="panel-footer">
                    <p>Soporte Técnico &copy; 2025</p>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;
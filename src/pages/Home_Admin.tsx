import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Asegúrate de tener React Router instalado y configurado
import '../styles/Home_Admin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // Estado para el mensaje de error
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');  // Limpia el error anterior
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Credenciales inválidas');
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/admin');  // Redirige al historial (configura esta ruta en tu router)
        } catch {
            setError('Usuario y clave incorrecta');  // Mensaje específico para credenciales erróneas
        }
    };

    return (
        <div className="admin-container">
            <div className="logo-section">
                <img src="../src/assets/lgo.png" alt="Logo INAMHI" className="logo-inamhi" />
            </div>
            <div className="login-card">
                <h2>INICIAR SESION</h2>
                <form onSubmit={handleLogin}>
                    <div className="inputs-row">
                        <div className="input-group">
                            <label>Correo Electrónico</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ingresa tu correo" required />
                        </div>
                        <div className="input-group">
                            <label>Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" required />
                        </div>
                    </div>
                    {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}  {/* Mensaje de error en la UI */}
                    <button type="submit" className="btn-ingresar">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
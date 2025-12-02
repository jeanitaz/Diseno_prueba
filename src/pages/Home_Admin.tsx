import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home_Admin.css';
import logoInamhi from '../assets/lgo.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
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
            navigate('/admin');
        } catch {
            setError('Usuario y clave incorrecta');
        }
    };

    return (
        <div className="admin-container">
            <div className="logo-section">
                <img src={logoInamhi} alt="Logo INAMHI" className="logo-inamhi" />
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
                    {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
                    <button type="submit" className="btn-ingresar">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreUsuarios.css';

const CreacionUsuarios = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'Tecnico',
        departamento: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    // Manejo de cambios
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Envío del formulario CONECTADO A BD
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // Validación básica
        if (!formData.nombre || !formData.email || !formData.password) {
            alert("Completa los campos requeridos");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Usuario creado con éxito en la base de datos!");
                navigate('/usuarios'); // Redirige al listado
            } else {
                alert("Error: " + (data.message || "No se pudo crear el usuario"));
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-layout">
            {/* Fondo Animado */}
            <div className="admin-bg-stars"></div>
            <div className="admin-bg-glow"></div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="admin-content">

                <header className="content-header">
                    <div className="header-titles">
                        <h1>Gestión de Usuarios</h1>
                        <p>Crear nueva credencial de acceso</p>
                    </div>
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        ⬅ Volver
                    </button>
                </header>

                {/* --- CARD DEL FORMULARIO (Centrada) --- */}
                <div className="form-container-centered">
                    <div className="glass-form-card">

                        <div className="form-header">
                            <div className="icon-circle">👤</div>
                            <h2>Datos del Nuevo Usuario</h2>
                            <p>Ingresa la información para registrar en el sistema.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="cyber-form">

                            {/* Nombre */}
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">Aa</span>
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Ej. Diego González"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label>Correo Institucional</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">@</span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="usuario@inamhi.gob.ec"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label>Contraseña Inicial</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="******"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-pass"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            {/* Grid 2 Columnas */}
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Rol</label>
                                    <select name="rol" value={formData.rol} onChange={handleChange}>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Tecnico">Técnico</option>
                                        <option value="Usuario">Usuario Final</option>
                                    </select>
                                </div>

                                <div className="form-group half">
                                    <label>Departamento</label>
                                    <select name="departamento" value={formData.departamento} onChange={handleChange}>
                                        <option value="">Seleccione...</option>
                                        <option value="RRHH">Recursos Humanos</option>
                                        <option value="Financiero">Financiero</option>
                                        <option value="Tecnologia">Tecnología</option>
                                        <option value="Gerencia">Gerencia</option>
                                        <option value="Hidrologia">Hidrología</option>
                                        <option value="Meteorologia">Meteorología</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-neon-primary" disabled={isLoading}>
                                     {isLoading ? 'Guardando...' : 'Guardar Usuario'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>

            </main>
        </div>
    );
}
export default CreacionUsuarios
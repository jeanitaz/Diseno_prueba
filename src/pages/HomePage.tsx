import '../styles/App.css';
import logoInamhi from '../assets/lgo.png';

const HomePage = () => {
    return (
        <div className="home-container" style={{ background: 'white', zIndex: 9999 }}>
            {/* Columna izquierda (logo) */}
            <div className="home-logo">
                <img src={logoInamhi} alt="Logo INAMHI" className="logo-inamhi" />
            </div>

            {/* Columna derecha (bienvenida) */}
            <div className="home-welcome">
                <div className="max-wl text-center">
                    <h1 className="text-5xl font-bold text-blue-700 leading-tight mb-6 drop-shadow-lg">
                        Bienvenido Al Sistema De Soporte Técnico INAMHI
                    </h1>
                    <p className="text-lg text-indigo-900 mb-8">
                        Nuestro equipo trabaja con dedicación para ofrecer soluciones confiables, ágiles y de calidad.
                    </p>
                    <a
                        href="/formulario"
                        className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-indigo-100 transition duration-300"
                    >
                        INGRESAR
                    </a>
                    <div>
                        <a href="/adminlogin">
                            <br />
                            <p className="text-sm text-black mt-4 underline hover:text-text cursor-pointer">
                                ¿Eres administrador? Haz clic aquí
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

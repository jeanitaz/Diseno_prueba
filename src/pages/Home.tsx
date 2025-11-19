import '../styles/App.css';

const Home = () => {
    return (
        <>
            <div className="flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-sky-100 via-indigo-200 to-indigo-400">

                {/* Columna izquierda (logo) */}
                <div className="lg:w-2/5 w-full flex items-center justify-center px-10 py-10 bg-transparent">
                    <img
                        src="../src/assets/lgo.png"
                        alt="Logo INAMHI"
                        className="logo-inamhi"
                    />
                </div>

                {/* Columna derecha */}
                <div className="lg:w-3/5 w-full flex flex-col justify-center items-center px-8 py-16">
                    <div className="text-center max-w-xl">
                        <h1 className="text-5xl font-bold text-blue-700 leading-tight mb-6 drop-shadow-lg">
                            Bienvenido al Sistema de Soporte Técnico INAMHI
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
                    </div>
                </div>

            </div>
        </>
    );
};

export default Home;
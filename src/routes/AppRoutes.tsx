import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home";
import Formulario from "../pages/Formulario";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/formulario" element={<Formulario/>} />
        </Routes>
    )
}

export default AppRoutes
import { Route, Routes } from "react-router-dom"
import HomePage from "../pages/HomePage";
import Historial_tickets from "../pages/Historial_tickets";
import Admin from "../pages/Admin";
import LoginAdmin from "../pages/LoginAdmin";
import Reportes from "../pages/Reportes";
import Formulario from "../pages/Formulario";
import TicketTracking from "../pages/RegistroTickets";
import SuperAdminDashboard from "../pages/Usuarios";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/formulario" element={<Formulario />} />
            <Route path="/listado" element={<Historial_tickets />} />
            <Route path="/registro" element={<TicketTracking />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/login" element={<LoginAdmin />} />
            <Route path="/reportes" element={<Reportes />} />

        </Routes>
    )
}

export default AppRoutes
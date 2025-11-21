import { useEffect, useState } from "react";
import "../styles/Historial.css";

type Ticket = {
    code: string;
    name: string;
    last?: string;
    address?: string;
    position?: string;
    email?: string;
    phone?: string;
    requestType?: string;
    otherRequest?: string;
    description?: string;
    fileName?: string;
    observations?: string;
    createdAt: string;
};

export default function Historial_tickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No autorizado. Inicia sesión.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/tickets', {
                headers: { 'Authorization': token }
            });
            if (!response.ok) throw new Error('Error al obtener tickets');
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar tickets.');
        }
    };

    const eliminar = async (code: string) => {
        const token = localStorage.getItem('token');
        if (!token || !confirm("¿Eliminar este ticket?")) return;
        try {
            const response = await fetch(`http://localhost:3000/api/tickets/${code}`, {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
            if (!response.ok) throw new Error('Error al eliminar');
            setTickets(tickets.filter(t => t.code !== code));
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar ticket.');
        }
    };

    const borrarTodo = async () => {
        if (!confirm("¿Borrar todos los tickets? Esta acción no se puede deshacer.")) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch('http://localhost:3000/api/tickets', {
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
            if (!response.ok) throw new Error('Error al borrar todos');
            setTickets([]);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al borrar todos.');
        }
    };

    const filtered = tickets.filter((t) => {
        const q = query.toLowerCase();
        return (
            t.code.toLowerCase().includes(q) ||
            t.name?.toLowerCase().includes(q) ||
            t.last?.toLowerCase().includes(q) ||
            t.position?.toLowerCase().includes(q) ||
            t.requestType?.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
        );
    });

    return (
        <>
        <div className="initial">
        <div className="historial-container animate-fadein">
            <h2 className="title">Historial de Tickets</h2>

            <div className="top-controls">
                <input
                    type="search"
                    className="input-search"
                    placeholder="Buscar por código, nombre, cargo..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button
                    onClick={fetchTickets}
                    className="btn-accent"
                >
                    Recargar
                </button>

                <button onClick={borrarTodo} className="btn-danger">
                    Borrar todo
                </button>
            </div>

            {filtered.length === 0 ? (
                <p className="no-data">No hay tickets para mostrar.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="ticket-table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Fecha</th>
                                <th>Solicitante</th>
                                <th>Cargo</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Archivo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((t, index) => (
                                <tr key={t.code} className="row-anim" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <td>{t.code}</td>
                                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                                    <td>{t.name} {t.last}</td>
                                    <td>{t.position}</td>
                                    <td>{t.requestType} {t.otherRequest && ` — ${t.otherRequest}`}</td>

                                    <td>
                                        {t.description && t.description.length > 120
                                            ? t.description.slice(0, 120) + "…"
                                            : t.description}
                                    </td>

                                    <td>{t.fileName ?? "-"}</td>

                                    <td className="actions">
                                        <button
                                            onClick={() => alert(`Descripción completa:\n\n${t.description ?? "Sin descripción"}`)}
                                            className="btn-view"
                                        >
                                            Ver
                                        </button>

                                        <button
                                            onClick={() => eliminar(t.code)}
                                            className="btn-delete"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </div>
        </>
    );
}
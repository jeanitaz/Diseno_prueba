import { useEffect, useState } from "react";
import "../styles/TicketsModal.css";

type Ticket = {
  code: string;
  name: string;
  last: string;
  position: string;
  requestType: string;
  createdAt: string;
  status?: string; // Pendiente, Aprobado, Rechazado
};

export default function TicketsModal({ onClose }: { onClose: () => void }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tickets');
        if (!response.ok) throw new Error('Error al obtener los tickets');
        const data: Ticket[] = await response.json();
        console.log('Tickets cargados desde la API:', data); // Depuración: Ver qué tickets se cargan
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filtrar solo si hay búsqueda, y por código, nombre o apellido
  const filtered = search.trim()
    ? tickets.filter((t) => {
        const searchTerm = search.toLowerCase();
        const ticketText = `${t.code} ${t.name} ${t.last}`.toLowerCase();
        return ticketText.includes(searchTerm);
      })
    : []; // No mostrar ninguno si no hay búsqueda

  console.log('Búsqueda actual:', search); // Depuración: Ver qué se está buscando
  console.log('Tickets filtrados:', filtered); // Depuración: Ver resultados del filtro

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top">
          <h2>📄 Mis Tickets Registrados</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <input
          className="search-bar"
          type="text"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p>Cargando tickets...</p>}
        {error && <p className="error">Error: {error}</p>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Solicitante</th>
                <th>Cargo</th>
                <th>Tipo</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t, i) => (
                  <tr key={i}>
                    <td>{t.code}</td>
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                    <td>{t.name} {t.last}</td>
                    <td>{t.position}</td>
                    <td>{t.requestType}</td>
                    <td>
                      <span className={`status-badge ${t.status || "pendiente"}`}>
                        {t.status || "Pendiente"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data">
                    {search.trim() ? "No se encontraron tickets" : "Ingresa un código o nombre para buscar"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
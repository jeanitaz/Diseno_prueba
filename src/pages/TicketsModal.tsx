


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

 useEffect(() => {
  const raw = localStorage.getItem("tickets");
  const parsed: Ticket[] = raw ? JSON.parse(raw) : [];
  setTickets(parsed);
}, []);


  const filtered = tickets.filter((t) =>
    `${t.code} ${t.name} ${t.last} ${t.position} ${t.requestType}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          placeholder="Buscar por código, nombre o cargo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

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
                  <td colSpan={6} className="no-data">No se encontraron tickets</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}





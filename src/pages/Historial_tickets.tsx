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
  status?: string; 
};

export default function Historial_tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("");
  
  // Estado para el ticket que estamos editando
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; 
    try {
      const response = await fetch('http://localhost:3000/api/tickets', {
        headers: { 'Authorization': token }
      });
      if (!response.ok) throw new Error('Error fetching');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setNewStatus(ticket.status || "Pendiente");
  };

  // Guardado local (simulado) como pediste
  const handleSaveStatus = () => {
    if (!editingTicket) return;

    const ticketsActualizados = tickets.map((t) => 
      t.code === editingTicket.code 
        ? { ...t, status: newStatus }
        : t
    );

    setTickets(ticketsActualizados);
    setEditingTicket(null);
  };

  const eliminar = async (code: string) => {
    const token = localStorage.getItem('token');
    if (!token || !confirm("¿Eliminar este ticket?")) return;
    try {
      await fetch(`http://localhost:3000/api/tickets/${code}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      setTickets(tickets.filter(t => t.code !== code));
    } catch (error) {
      alert('Error al eliminar ticket.');
    }
  };

  const borrarTodo = async () => {
    if (!confirm("¿Borrar TODO? Irreversible.")) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch('http://localhost:3000/api/tickets', { method: 'DELETE', headers: {'Authorization': token} });
      setTickets([]);
    } catch (error) {
      alert('Error al borrar todo.');
    }
  };

  const filtered = tickets.filter((t) => {
    const q = query.toLowerCase();
    return (
      t.code.toLowerCase().includes(q) ||
      t.name?.toLowerCase().includes(q) ||
      t.last?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      (t.status && t.status.toLowerCase().includes(q))
    );
  });

  // --- NUEVA LÓGICA DE ESTADOS (Traída de TicketsModal) ---
  const getStatusClass = (status?: string) => {
    const s = status ? status.toLowerCase() : "";
    if (s.includes("resuelto") || s.includes("aprobado")) return "badge-success";
    if (s.includes("proceso")) return "badge-warning";
    if (s.includes("rechazado") || s.includes("cancelado")) return "badge-danger";
    return "badge-pending"; // Por defecto
  };

  return (
    <div className="historial-container animate-fadein">
      <h2 className="title">Historial de Tickets</h2>

      <div className="top-controls">
        <input
          type="search"
          className="input-search"
          placeholder="Buscar por código, nombre, estado..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchTickets} className="btn-accent">Recargar</button>
        <button onClick={borrarTodo} className="btn-danger">Borrar todo</button>
      </div>

      {filtered.length === 0 ? (
        <p className="no-data">No se encontraron tickets registrados.</p>
      ) : (
        <div className="table-wrapper">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Solicitante</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, index) => (
                <tr key={t.code} className="row-anim" style={{ animationDelay: `${index * 0.05}s` }}>
                  <td data-label="Código"><span className="ticket-code">{t.code}</span></td>
                  <td data-label="Solicitante">
                    <strong>{t.name} {t.last}</strong><br/>
                    <small className="text-muted">{t.position}</small>
                  </td>
                  <td data-label="Tipo">{t.requestType}</td>
                  
                  <td data-label="Estado">
                    {/* Usamos getStatusClass aquí */}
                    <span className={`status-badge ${getStatusClass(t.status)}`}>
                      {t.status || "Pendiente"}
                    </span>
                  </td>

                  <td data-label="Descripción">
                    <div className="ticket-desc">{t.description ?? "-"}</div>
                  </td>

                  <td data-label="Acciones">
                    <div className="actions">
                      <button 
                        onClick={() => handleOpenEdit(t)} 
                        className="btn-view"
                        title="Gestionar Ticket"
                      >
                        Gestionar
                      </button>
                      <button onClick={() => eliminar(t.code)} className="btn-delete" title="Eliminar">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL DE EDICIÓN --- */}
      {editingTicket && (
        <div className="modal-overlay" onClick={() => setEditingTicket(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gestionar Ticket: {editingTicket.code}</h3>
              <button className="close-btn" onClick={() => setEditingTicket(null)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="info-group">
                <label>Solicitante:</label>
                <p>{editingTicket.name} {editingTicket.last}</p>
              </div>
              <div className="info-group">
                <label>Descripción Completa:</label>
                <div className="desc-box">{editingTicket.description}</div>
              </div>
              <div className="info-group">
                <label>Archivo Adjunto:</label>
                <p>{editingTicket.fileName ? `📎 ${editingTicket.fileName}` : "Sin adjuntos"}</p>
              </div>

              <hr />

              <div className="form-group">
                <label htmlFor="statusSelect"><strong>Actualizar Estado:</strong></label>
                <select 
                  id="statusSelect"
                  value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="status-select"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelto">Resuelto</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditingTicket(null)}>Cancelar</button>
              <button className="btn-save" onClick={handleSaveStatus}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
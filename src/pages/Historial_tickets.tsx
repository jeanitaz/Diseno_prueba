import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Historial.css';
import logoInamhi from '../assets/lgo.png';

// --- ICONOS SVG ---
const BackIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>);
const SearchIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const FilterIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>);
const DownloadIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const EyeIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>);

interface Ticket {
  id: string;
  date: string;
  name: string;
  area: string;
  type: string;
  tech: string;
  status: string;
}

const TicketHistory = () => {
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);

  // --- CARGAR DATOS DESDE EL BACKEND (BD) ---
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Llamada al nuevo endpoint que creamos en server.js
        const response = await fetch('http://localhost:3001/api/tickets');

        if (response.ok) {
          const data = await response.json();
          setAllTickets(data);
        } else {
          console.error("Error obteniendo historial");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // --- FILTRADO (Se mantiene igual, filtra sobre lo que bajó de la BD) ---
  const filteredTickets = allTickets.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    const matchText =
      (ticket.name?.toLowerCase() || '').includes(term) ||
      (ticket.id?.toLowerCase() || '').includes(term) ||
      (ticket.area?.toLowerCase() || '').includes(term);

    const matchStatus = statusFilter === 'Todos' || ticket.status === statusFilter;

    return matchText && matchStatus;
  });

  // --- EXPORTAR ---
  const handleExport = () => {
    if (filteredTickets.length === 0) return;

    const headers = ["ID", "Fecha", "Solicitante", "Área", "Problema", "Técnico", "Estado"];
    const rows = filteredTickets.map(t => [
      t.id, t.date, `"${t.name}"`, `"${t.area}"`, `"${t.type}"`, t.tech, t.status
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Tickets_Inamhi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusClass = (status: string) => {
    // Manejo seguro por si status viene null
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'resuelto': return 'status-resolved';
      case 'en proceso': return 'status-process';
      default: return 'status-pending';
    }
  };

  return (
    <div className="historial-layout">
      {/* Fondo Animado */}
      <div className="bg-stars"></div>
      <div className="bg-glow"></div>

      <div className="historial-container animate-enter">

        {/* HEADER */}
        <header className="historial-header">
          <div className="header-brand">
            <Link to="/admin" className="btn-back-circle" title="Volver">
              <BackIcon />
            </Link>
            <img src={logoInamhi} alt="INAMHI" className="brand-logo" />
            <div className="brand-text">
              <h1>Gestión de Incidencias</h1>
              <p>Base de datos de soporte técnico</p>
            </div>
          </div>

          <button
            className={`btn-primary ${filteredTickets.length === 0 ? 'disabled' : ''}`}
            onClick={handleExport}
            disabled={filteredTickets.length === 0}
          >
            <DownloadIcon /> <span>Descargar Reporte</span>
          </button>
        </header>

        {/* CONTROLES */}
        <div className="controls-panel">
          <div className="search-group">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar por ID, nombre, área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <FilterIcon />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Resuelto">Resuelto</option>
            </select>
          </div>
        </div>

        {/* TABLA */}
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID Ticket</th>
                <th>Fecha</th>
                <th>Solicitante</th>
                <th>Área</th>
                <th>Tipo de Falla</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="state-cell">Cargando datos desde el servidor...</td></tr>
              ) : filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, i) => (
                  <tr key={ticket.id || i}>
                    <td className="col-id">{ticket.id}</td>
                    <td className="col-date">{ticket.date}</td>
                    <td className="col-main">{ticket.name}</td>
                    <td>{ticket.area}</td>
                    <td>{ticket.type}</td>
                    <td className="col-tech">{ticket.tech}</td>
                    <td>
                      <span className={`badge ${getStatusClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn-action" title="Ver detalle">
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="state-cell">
                    {allTickets.length === 0
                      ? "No hay tickets registrados en la base de datos."
                      : "No se encontraron resultados con los filtros actuales."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="historial-footer">
          Mostrando <strong>{filteredTickets.length}</strong> registros
        </div>

      </div>
    </div>
  );
};

export default TicketHistory;
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import '../styles/Reporte.css';

// --- MOCK DATA (Simulación de Base de Datos) ---
const dataMonthly = [
    { name: 'Ene', tickets: 45 }, { name: 'Feb', tickets: 52 },
    { name: 'Mar', tickets: 38 }, { name: 'Abr', tickets: 65 },
    { name: 'May', tickets: 48 }, { name: 'Jun', tickets: 59 },
];

const dataStatus = [
    { name: 'Resueltos', value: 340 },
    { name: 'Pendientes', value: 45 },
];

const dataArea = [
    { name: 'Meteorología', tickets: 85 },
    { name: 'Hidrología', tickets: 62 },
    { name: 'Administrativo', tickets: 40 },
    { name: 'Dirección Exec', tickets: 15 },
    { name: 'TI', tickets: 25 },
];

const dataType = [
    { name: 'Hardware', count: 120 },
    { name: 'Software', count: 98 },
    { name: 'Redes', count: 45 },
    { name: 'Acceso/Usuario', count: 30 },
];

const dataTech = [
    { name: 'J. Pérez', tickets: 110, avgTime: 2.5 },
    { name: 'M. López', tickets: 95, avgTime: 3.1 },
    { name: 'A. Torres', tickets: 85, avgTime: 1.8 },
    { name: 'D. González', tickets: 70, avgTime: 4.0 },
];

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

// --- ICONOS SVG ---
const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);
const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
);

const ReportsView = () => {
    const [loadingPdf, setLoadingPdf] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    // Función para exportar a PDF
    const handleExportPDF = async () => {
        const element = printRef.current;
        if (!element) return;

        setLoadingPdf(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2, // Mejor calidad
                backgroundColor: '#0f172a', // Color de fondo oscuro para el PDF
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Reporte_INAMHI_Soporte.pdf');
        } catch (error) {
            console.error("Error al exportar PDF", error);
        }
        setLoadingPdf(false);
    };

    return (
        <div className="reports-container">
            {/* Fondo animado consistente */}
            <div className="stars"></div>

            <div className="reports-header">
                <Link to="/admin" className="btn-back-nav">
                    <BackIcon /> Regresar
                </Link>
                <h1>Panel de Métricas y Reportes</h1>
                <button
                    className="btn-export"
                    onClick={handleExportPDF}
                    disabled={loadingPdf}
                >
                    <DownloadIcon /> {loadingPdf ? 'Generando...' : 'Exportar PDF'}
                </button>
            </div>

            {/* Contenedor Principal para capturar en PDF */}
            <div className="dashboard-grid" ref={printRef}>

                {/* FILA 1: KPIs y Tiempos */}
                <div className="card kpi-card">
                    <h3>Total Tickets (Mes)</h3>
                    <div className="kpi-value">345</div>
                    <span className="kpi-trend positive">↑ 12% vs mes anterior</span>
                </div>

                <div className="card kpi-card">
                    <h3>Tiempo Promedio Atención</h3>
                    <div className="kpi-value">2.4 <small>hrs</small></div>
                    <span className="kpi-sub">Meta: &lt; 3.0 hrs</span>
                </div>

                <div className="card chart-card wide">
                    <h3>Evolución de Tickets (Semestral)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={dataMonthly}>
                            <defs>
                                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Area type="monotone" dataKey="tickets" stroke="#8884d8" fillOpacity={1} fill="url(#colorTickets)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* FILA 2: Distribución y Estado */}
                <div className="card chart-card">
                    <h3>Estado de Tickets</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={dataStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {dataStatus.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <h3>Por Dirección / Área</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dataArea} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={false} />
                            <XAxis type="number" stroke="#ccc" hide />
                            <YAxis dataKey="name" type="category" width={100} stroke="#ccc" style={{ fontSize: '0.8rem' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Bar dataKey="tickets" fill="#0088FE" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* FILA 3: Técnicos y Tipos */}
                <div className="card chart-card wide">
                    <h3>Rendimiento por Técnico</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dataTech}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <Legend />
                            <Bar dataKey="tickets" name="Tickets Resueltos" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="avgTime" name="Tiempo Prom. (hrs)" fill="#ffc658" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card chart-card">
                    <h3>Por Tipo de Requerimiento</h3>
                    <ul className="stats-list">
                        {dataType.map((item, idx) => (
                            <li key={idx}>
                                <div className="stat-info">
                                    <span>{item.name}</span>
                                    <span className="count">{item.count}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(item.count / 150) * 100}%`,
                                            backgroundColor: COLORS[idx % COLORS.length]
                                        }}
                                    ></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default ReportsView;
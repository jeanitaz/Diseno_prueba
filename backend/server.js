const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Permite que React se conecte
app.use(bodyParser.json());

// 1. CONFIGURACIÓN DE LA BASE DE DATOS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Tu usuario de MySQL
    password: '0993643838Jc',      // Tu contraseña de MySQL
    database: 'diseno_prueba' // El nombre de tu base de datos
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a MySQL exitosamente.');
});

// 2. ENDPOINT PARA CREAR TICKET
app.post('/api/tickets', (req, res) => {
    const {
        fullName, area, position, email, phone,
        reqType, otherDetail, description, observations
    } = req.body;

    // Validación básica
    if (!fullName || !area || !reqType || !description) {
        return res.status(400).send({ message: 'Faltan campos obligatorios' });
    }

    const sql = `
        INSERT INTO tickets_soporte (
            nombre_completo, 
            cargo, 
            correo_institucional, 
            telefono_extension, 
            id_area, 
            id_tipo_requerimiento, 
            detalle_otro_requerimiento, 
            descripcion_problema, 
            observaciones_adicionales
        ) VALUES (
            ?, ?, ?, ?, 
            (SELECT id_area FROM catalogo_areas WHERE nombre_area = ? LIMIT 1),
            (SELECT id_tipo FROM catalogo_tipos WHERE nombre_tipo = ? LIMIT 1),
            ?, ?, ?
        )
    `;

    const values = [
        fullName, position, email, phone,
        area,       // Se usará para buscar el id_area
        reqType,    // Se usará para buscar el id_tipo_requerimiento
        otherDetail || null,
        description,
        observations || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error al guardar en base de datos', error: err });
        }

        // Devolvemos el ID generado por AUTO_INCREMENT
        const newTicketId = `SSTI-${new Date().getFullYear()}-${String(result.insertId).padStart(4, '0')}`;
        res.status(200).send({
            message: 'Ticket creado correctamente',
            ticketId: newTicketId
        });
    });
});

// 3. ENDPOINT PARA BUSCAR TICKET
app.get('/api/tickets/search', (req, res) => {
    const term = req.query.term;
    if (!term) {
        return res.status(400).send({ message: 'Término de búsqueda requerido' });
    }

    const sql = `
        SELECT 
            t.*, 
            a.nombre_area as area, 
            tr.nombre_tipo as tipo
        FROM tickets_soporte t
        LEFT JOIN catalogo_areas a ON t.id_area = a.id_area
        LEFT JOIN catalogo_tipos tr ON t.id_tipo_requerimiento = tr.id_tipo
        WHERE 
            t.nombre_completo LIKE ? 
            OR CONCAT('SSTI-', YEAR(t.fecha_creacion), '-', LPAD(t.id_ticket, 4, '0')) = ?
    `;

    const searchTermLike = `%${term}%`;

    db.query(sql, [searchTermLike, term], (err, results) => {
        if (err) {
            console.error("Error en búsqueda:", err);
            return res.status(500).send({ message: 'Error en el servidor' });
        }

        if (results.length === 0) {
            return res.status(404).send({ message: 'No se encontró el ticket' });
        }

        // Tomamos el primer resultado
        const ticket = results[0];

        // Construimos el ID visual
        const formattedTicket = {
            ...ticket,
            id_visual: `SSTI-${new Date(ticket.fecha_creacion).getFullYear()}-${String(ticket.id_ticket).padStart(4, '0')}`
        };

        res.json(formattedTicket);
    });
});
app.get('/api/tickets', (req, res) => {
    // Obtenemos todos los tickets ordenados por fecha (más reciente primero)
    const sql = `
        SELECT 
            t.id_ticket,
            t.nombre_completo,
            c_area.nombre_area AS area,
            c_tipo.nombre_tipo AS tipo,
            t.estado,
            t.fecha_creacion
        FROM tickets_soporte t
        LEFT JOIN catalogo_areas c_area ON t.id_area = c_area.id_area
        LEFT JOIN catalogo_tipos c_tipo ON t.id_tipo_requerimiento = c_tipo.id_tipo
        ORDER BY t.fecha_creacion DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error al obtener historial' });
        }

        // Formateamos los datos para el Frontend
        const history = results.map(ticket => {
            const dateObj = new Date(ticket.fecha_creacion);
            const year = dateObj.getFullYear();
            
            return {
                id: `SSTI-${year}-${String(ticket.id_ticket).padStart(4, '0')}`,
                date: dateObj.toLocaleDateString('es-EC'), // Fecha legible
                name: ticket.nombre_completo,
                area: ticket.area,
                type: ticket.tipo,
                status: ticket.estado,
                tech: 'Por Asignar' // Valor por defecto
            };
        });

        app.post('/api/usuarios', (req, res) => {
    const { nombre, email, password, rol, departamento } = req.body;

    // Validación básica
    if (!nombre || !email || !password || !rol) {
        return res.status(400).send({ message: 'Faltan campos obligatorios' });
    }

    const sql = `INSERT INTO usuarios (nombre_completo, email, password, rol, departamento) VALUES (?, ?, ?, ?, ?)`;
    
    const values = [nombre, email, password, rol, departamento];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            // Detectar error de correo duplicado (código 1062 en MySQL)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send({ message: 'El correo electrónico ya está registrado.' });
            }
            return res.status(500).send({ message: 'Error al registrar usuario', error: err });
        }
        res.status(200).send({ message: 'Usuario creado exitosamente', userId: result.insertId });
    });
});
        res.json(history);
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
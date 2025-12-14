const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const config = require('./dbConfig');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database Connection
sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to SQL Server');
    }
}).catch(err => {
    console.error('Database connection failed:', err);
});

// Helper function for error handling
const handleError = (res, err) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
};

// --- API Routes ---

// 1. Patient Routes
app.get('/api/patients', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetPatients');
        res.json(result.recordset);
    } catch (err) {
        handleError(res, err);
    }
});

app.post('/api/patients', async (req, res) => {
    const { first_name, last_name, phone, medical_history, date_of_birth, gender, email, address } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('first_name', sql.NVarChar, first_name)
            .input('last_name', sql.NVarChar, last_name)
            .input('phone', sql.NVarChar, phone)
            .input('medical_history', sql.NVarChar, medical_history)
            .input('date_of_birth', sql.Date, date_of_birth)
            .input('gender', sql.NVarChar, gender)
            .input('email', sql.NVarChar, email)
            .input('address', sql.NVarChar, address)
            .execute('sp_CreatePatient');
        res.status(201).json({ message: 'Patient created successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone, medical_history, date_of_birth, gender, email, address } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .input('first_name', sql.NVarChar, first_name)
            .input('last_name', sql.NVarChar, last_name)
            .input('phone', sql.NVarChar, phone)
            .input('medical_history', sql.NVarChar, medical_history)
            .input('date_of_birth', sql.Date, date_of_birth)
            .input('gender', sql.NVarChar, gender)
            .input('email', sql.NVarChar, email)
            .input('address', sql.NVarChar, address)
            .execute('sp_UpdatePatient');
        res.json({ message: 'Patient updated successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

app.delete('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .execute('sp_DeletePatient');
        res.json({ message: 'Patient deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

// 1.1 Helper Routes (Dentists, Rooms)
app.get('/api/dentists', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetDentists');
        res.json(result.recordset);
    } catch (err) {
        handleError(res, err);
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetClinicRooms');
        res.json(result.recordset);
    } catch (err) {
        handleError(res, err);
    }
});

app.get('/api/assistants', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAssistants');
        res.json(result.recordset);
    } catch (err) {
        handleError(res, err);
    }
});

// 2. Treatment Routes
app.get('/api/treatments', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetTreatments');
        res.json(result.recordset);
    } catch (err) {
        handleError(res, err);
    }
});

app.post('/api/treatments', async (req, res) => {
    const { name, price } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('price', sql.Decimal, price)
            .execute('sp_CreateTreatment');
        res.status(201).json({ message: 'Treatment created successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

app.put('/api/treatments/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('price', sql.Decimal, price)
            .execute('sp_UpdateTreatment');
        res.json({ message: 'Treatment updated successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

app.delete('/api/treatments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .execute('sp_DeleteTreatment');
        res.json({ message: 'Treatment deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

// 3. Payment Routes
app.get('/api/payments', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetPayments');
        res.json(result.recordset);
    } catch (err) {
        handleError(res, err);
    }
});

app.post('/api/payments', async (req, res) => {
    const { appointment_id, amount, payment_date, payment_method, status } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('appointment_id', sql.Int, appointment_id)
            .input('amount', sql.Decimal, amount)
            .input('payment_date', sql.DateTime, payment_date)
            .input('payment_method', sql.NVarChar, payment_method)
            .input('status', sql.NVarChar, status)
            .execute('sp_CreatePayment');
        res.status(201).json({ message: 'Payment recorded successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

app.put('/api/payments/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, payment_method, status } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .input('amount', sql.Decimal, amount)
            .input('payment_method', sql.NVarChar, payment_method)
            .input('status', sql.NVarChar, status)
            .execute('sp_UpdatePayment');
        res.json({ message: 'Payment updated successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

app.delete('/api/payments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .execute('sp_DeletePayment');
        res.json({ message: 'Payment deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

// 4. Appointment Routes
app.get('/api/appointments', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().execute('sp_GetAppointments');
        res.json(result.recordset);
    } catch (err) {
        handleError(res, err);
    }
});

app.post('/api/appointments', async (req, res) => {
    const { patient_id, dentist_id, room_id, assistant_id, appointment_date, status } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('patient_id', sql.Int, patient_id)
            .input('dentist_id', sql.Int, dentist_id)
            .input('room_id', sql.Int, room_id)
            .input('assistant_id', sql.Int, assistant_id || null) // Handle optional assistant
            .input('appointment_date', sql.DateTime, appointment_date)
            .input('status', sql.NVarChar, status)
            .execute('sp_CreateAppointment');
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (err) {
        // Forward SQL errors (like our custom conflict error)
        if (err.number >= 50000) { 
             res.status(409).json({ error: 'Conflict', details: err.message });
        } else {
             handleError(res, err);
        }
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { appointment_date, status, room_id } = req.body;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .input('appointment_date', sql.DateTime, appointment_date)
            .input('status', sql.NVarChar, status)
            .input('room_id', sql.Int, room_id)
            .execute('sp_UpdateAppointment');
        res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .execute('sp_DeleteAppointment');
        res.json({ message: 'Appointment deleted successfully' });
    } catch (err) {
        handleError(res, err);
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

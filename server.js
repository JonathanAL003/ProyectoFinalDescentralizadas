require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const doctorRoutes = require('./routes/doctorsRoutes');
const patientsRoutes = require('./routes/patientsRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/doctors', doctorRoutes);
app.use('/patients', patientsRoutes);
app.use('/prescriptions',prescriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
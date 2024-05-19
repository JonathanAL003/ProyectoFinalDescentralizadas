const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

router.post('/register', async (req, res) => {
    try {
        const { doctorId, patientId, medications } = req.body;
        const result = await prescriptionController.registerPrescription(doctorId, patientId, medications);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const prescriptions = await prescriptionController.getAllPrescriptions();
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const prescriptionId = parseInt(req.params.id);
        const prescription = await prescriptionController.getPrescriptionById(prescriptionId);
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/patients/:id', async (req, res) => {
    try {
        const patientId = parseInt(req.params.id);
        const prescriptions = await prescriptionController.getPrescriptionsByPatientId(patientId);
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/doctors/:id', async (req, res) => {
    try {
        const doctorId = parseInt(req.params.id);
        const prescriptions = await prescriptionController.getPrescriptionsByDoctorId(doctorId);
        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/remove/:id', async (req, res) => {
    try {
        const prescriptionId = parseInt(req.params.id);
        const result = await prescriptionController.removePrescription(prescriptionId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

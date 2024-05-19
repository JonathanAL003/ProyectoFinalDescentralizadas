const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorsController');

// Registrar un nuevo doctor
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, professionalLicense, specialty, email, phoneNumber } = req.body;
        const result = await doctorController.registerDoctor(firstName, lastName, professionalLicense, specialty, email, phoneNumber);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener la información de un doctor por su ID único
router.get('/:doctorId', async (req, res) => {
    try {
        const doctor = await doctorController.getDoctor(req.params.doctorId);
        res.json(doctor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Obtener la información de todos los doctores
router.get('/', async (req, res) => {
    try {
        const doctors = await doctorController.getAllDoctors();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar la información de un doctor por su ID único
router.put('/:doctorId', async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        const result = await doctorController.updateDoctor(req.params.doctorId, email, phoneNumber);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un doctor por su ID único
router.delete('/:doctorId', async (req, res) => {
    try {
        const result = await doctorController.removeDoctor(req.params.doctorId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
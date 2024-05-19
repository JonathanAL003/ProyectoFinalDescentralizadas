const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientsController');

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, age, sex, allergies, height, weight, bloodType } = req.body;
        const result = await patientController.registerPatient(firstName, lastName, phoneNumber, age, sex, allergies, height, weight, bloodType);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:patientId', async (req, res) => {
    try {
        const patient = await patientController.getPatient(req.params.patientId);
        res.json(patient);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const patients = await patientController.getAllPatients();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:patientId', async (req, res) => {
    try {
        const { phoneNumber, age, allergies, height, weight } = req.body;
        const result = await patientController.updatePatient(req.params.patientId, phoneNumber, age, allergies, height, weight);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:patientId', async (req, res) => {
    try {
        const result = await patientController.removePatient(req.params.patientId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
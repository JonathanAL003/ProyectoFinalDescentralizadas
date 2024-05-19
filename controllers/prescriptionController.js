const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const PrescriptionContractABI = require('../artifacts/contracts/Prescription.sol/MedicalPrescriptions.json').abi;

const prescriptionContract = new ethers.Contract(process.env.PRESCRIPTION_CONTRACT, PrescriptionContractABI, signer);

async function registerPrescription(doctorId, patientId, medications) {
    return await prescriptionContract.registerPrescription(doctorId, patientId, medications);
}

async function getPrescriptionById(prescriptionId) {
    const prescription = await prescriptionContract.getPrescriptionById(prescriptionId);
    return formatPrescription(prescription);
}

async function getPrescriptionsByPatientId(patientId) {
    const prescriptions = await prescriptionContract.getPrescriptionsByPatientId(patientId);
    return prescriptions.map(formatPrescription);
}

async function getPrescriptionsByDoctorId(doctorId) {
    const prescriptions = await prescriptionContract.getPrescriptionsByDoctorId(doctorId);
    return prescriptions.map(formatPrescription);
}

async function getAllPrescriptions() {
    const prescriptions = await prescriptionContract.getAllPrescriptions();
    return prescriptions.map(formatPrescription);
}

async function updatePrescription(prescriptionId, medicationIndex) {
    return await prescriptionContract.updatePrescription(prescriptionId, medicationIndex);
}

async function removePrescription(prescriptionId) {
    return await prescriptionContract.removePrescription(prescriptionId);
}

function formatPrescription(prescription) {
    return {
        prescriptionId: prescription.prescriptionId.toNumber(),
        doctorId: prescription.doctorId.toNumber(),
        patientId: prescription.patientId.toNumber(),
        medications: prescription.medications
    };
}

module.exports = {
    registerPrescription,
    getPrescriptionById,
    getPrescriptionsByPatientId,
    getPrescriptionsByDoctorId,
    getAllPrescriptions,
    updatePrescription,
    removePrescription
};

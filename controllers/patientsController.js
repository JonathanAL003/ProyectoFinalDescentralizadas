const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const PatientContractABI = require('../artifacts/contracts/Patient.sol/Patients.json').abi;

const patientContract = new ethers.Contract(process.env.PATIENT_CONTRACT, PatientContractABI, signer);

async function registerPatient(firstName, lastName, phoneNumber, age, sex, allergies, height, weight, bloodType) {
    return await patientContract.registerPatient(firstName, lastName, phoneNumber, age, sex, allergies, height, weight, bloodType);
}

async function getPatient(patientId) {
    const patient = await patientContract.getPatient(patientId);
    return formatPatient(patient);
}

async function getAllPatients() {
    const allPatients = await patientContract.getAllPatients();
    return allPatients.map(formatPatient);
}

async function updatePatient(patientId, phoneNumber, age, allergies, height, weight) {
    return await patientContract.updatePatient(patientId, phoneNumber, age, allergies, height, weight);
}

async function removePatient(patientId) {
    return await patientContract.removePatient(patientId);
}

function formatPatient(patient) {
    return {
        patientId: patient.patientId.toNumber(),
        firstName: patient.firstName,
        lastName: patient.lastName,
        phoneNumber: patient.phoneNumber,
        age: patient.age.toNumber(),
        sex: patient.sex,
        allergies: patient.allergies,
        height: patient.height.toNumber(),
        weight: patient.weight.toNumber(),
        bloodType: patient.bloodType
    };
}

module.exports = {
    registerPatient,
    getPatient,
    getAllPatients,
    updatePatient,
    removePatient
};
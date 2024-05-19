const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const DoctorContractABI = require('../artifacts/contracts/Doctor.sol/Doctors.json').abi;

const doctorContract = new ethers.Contract(process.env.DOCTOR_CONTRACT, DoctorContractABI, signer);

async function registerDoctor(firstName, lastName, professionalLicense, specialty, email, phoneNumber) {
    return await doctorContract.registerDoctor(firstName, lastName, professionalLicense, specialty, email, phoneNumber);
}

async function getDoctor(doctorId) {
    const doctor = await doctorContract.getDoctor(doctorId);
    return formatDoctor(doctor);
}

async function getAllDoctors() {
    const allDoctors = await doctorContract.getAllDoctors();
    return allDoctors.map(formatDoctor);
}

async function updateDoctor(doctorId, email, phoneNumber) {
    return await doctorContract.updateDoctor(doctorId, email, phoneNumber);
}

async function removeDoctor(doctorId) {
    return await doctorContract.removeDoctor(doctorId);
}

function formatDoctor(doctor) {
    return {
        id: doctor.id.toNumber(), 
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        professionalLicense: doctor.professionalLicense,
        specialty: doctor.specialty,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber
    };
}

module.exports = {
    registerDoctor,
    getDoctor,
    getAllDoctors,
    updateDoctor,
    removeDoctor
};
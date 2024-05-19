async function main() {
    const MedicalPrescriptions = await ethers.getContractFactory('MedicalPrescriptions');

    const doctorsAddress = process.env.DOCTOR_CONTRACT;
    const patientsAddress = process.env.PATIENT_CONTRACT;
process.env.DOCTOR_CONTRACT
    const medicalPrescriptions = await MedicalPrescriptions.deploy(doctorsAddress, patientsAddress);
    console.log("MedicalPrescriptions Contract Address:", medicalPrescriptions.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});

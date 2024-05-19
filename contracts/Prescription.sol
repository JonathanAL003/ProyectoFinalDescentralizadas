// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Importar los contratos de Doctor y Patient
import "./Doctor.sol";
import "./Patient.sol";

contract MedicalPrescriptions {
    struct Prescription {
        uint256 prescriptionId;
        uint256 doctorId;
        uint256 patientId;
        string[] medications;
    }

    mapping(uint256 => Prescription) public prescriptions;
    mapping(uint256 => bool) public prescriptionExists;
    uint256 public totalPrescriptions;
    uint256 public nextPrescriptionId = 1;

    Doctors public doctorsContract; 
    Patients public patientsContract; 

    event PrescriptionRegistered(uint256 prescriptionId);
    event PrescriptionUpdated(uint256 prescriptionId);
    event PrescriptionRemoved(uint256 prescriptionId);

    modifier validId(uint256 _id) {
        require(_id != 0, "ID no puede ser 0");
        _;
    }

    modifier doctorAndPatientExist(uint256 _doctorId, uint256 _patientId) {
        require(doctorsContract.isDoctor(_doctorId), "El doctor no existe");
        require(patientsContract.isPatient(_patientId), "El paciente no existe");
        _;
    }

    modifier medicationPrescribed(uint256 _prescriptionId) {
        require(prescriptions[_prescriptionId].medications.length > 0, "Medicamento comprado");
        _;
    }

    modifier medicationNotPrescribed(uint256 _prescriptionId) {
        require(prescriptions[_prescriptionId].medications.length == 0, "Medicamento no comprado");
        _;
    }

    constructor(address _doctorsContractAddress, address _patientsContractAddress) {
        doctorsContract = Doctors(_doctorsContractAddress);
        patientsContract = Patients(_patientsContractAddress);
    }

    function registerPrescription(uint256 _doctorId, uint256 _patientId, string[] memory _medications) external doctorAndPatientExist(_doctorId, _patientId) medicationNotPrescribed(nextPrescriptionId) {
        Prescription memory newPrescription = Prescription({
            prescriptionId: nextPrescriptionId,
            doctorId: _doctorId,
            patientId: _patientId,
            medications: _medications
        });

        prescriptions[nextPrescriptionId] = newPrescription;
        prescriptionExists[nextPrescriptionId] = true;
        totalPrescriptions++; 
        emit PrescriptionRegistered(nextPrescriptionId);
        nextPrescriptionId++;
    }

    function getAllPrescriptions() external view returns (Prescription[] memory) {
        uint256 count;
        for (uint256 i = 1; i < nextPrescriptionId; i++) {
            if (prescriptionExists[i]) {
                count++;
            }
        }
        Prescription[] memory validPrescriptions = new Prescription[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < nextPrescriptionId; i++) {
            if (prescriptionExists[i]) {
                validPrescriptions[index] = prescriptions[i];
                index++;
            }
        }
        return validPrescriptions;
    }

    function getPrescriptionById(uint256 _prescriptionId) external view validId(_prescriptionId) returns (Prescription memory) {
        require(prescriptionExists[_prescriptionId], "La receta no existe");
        return prescriptions[_prescriptionId];
    }

    function getPrescriptionsByPatientId(uint256 _patientId) external view returns (Prescription[] memory) {
        uint256 count;
        for (uint256 i = 1; i < nextPrescriptionId; i++) {
            if (prescriptions[i].patientId == _patientId && prescriptionExists[i]) {
                count++;
            }
        }

        Prescription[] memory result;
        if (count > 0) {
            result = new Prescription[](count);
            uint256 index;
            for (uint256 i = 1; i < nextPrescriptionId; i++) {
                if (prescriptions[i].patientId == _patientId && prescriptionExists[i]) {
                    result[index] = prescriptions[i];
                    index++;
                }
            }
        }
        return result;
    }

    function getPrescriptionsByDoctorId(uint256 _doctorId) external view returns (Prescription[] memory) {
        uint256 count;
        for (uint256 i = 1; i < nextPrescriptionId; i++) {
            if (prescriptions[i].doctorId == _doctorId && prescriptionExists[i]) {
                count++;
            }
        }

        Prescription[] memory result;
        if (count > 0) {
            result = new Prescription[](count);
            uint256 index;
            for (uint256 i = 1; i < nextPrescriptionId; i++) {
                if (prescriptions[i].doctorId == _doctorId && prescriptionExists[i]) {
                    result[index] = prescriptions[i];
                    index++;
                }
            }
        }
        return result;
    }

    function removePrescription(uint256 _prescriptionId) external validId(_prescriptionId) {
        require(prescriptionExists[_prescriptionId], "La receta no existe");
        delete prescriptions[_prescriptionId];
        delete prescriptionExists[_prescriptionId];
        totalPrescriptions--;
        emit PrescriptionRemoved(_prescriptionId);
    }
}
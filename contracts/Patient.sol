// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Patients is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _patientIds;

    struct Patient {
        string firstName;
        string lastName;
        uint256 patientId;
        string phoneNumber; 
        uint256 age; 
        string sex; 
        string allergies; 
        uint256 height; 
        uint256 weight; 
        string bloodType; 
    }

    mapping(uint256 => Patient) private patients;
    mapping(uint256 => bool) private patientExists;
    uint256[] private activePatientIds;

    event PatientRegistered(uint256 patientId);

    modifier onlyExistingPatient(uint256 _patientId) {
        require(_patientId > 0 && _patientId <= _patientIds.current(), "Patient does not exist");
        require(patientExists[_patientId], "Patient does not exist");
        _;
    }

    function registerPatient(
        string memory _firstName,
        string memory _lastName,
        string memory _phoneNumber,
        uint256 _age,
        string memory _sex,
        string memory _allergies,
        uint256 _height,
        uint256 _weight,
        string memory _bloodType
    ) external onlyOwner {
        _patientIds.increment(); 
        uint256 patientId = _patientIds.current();

        Patient memory newPatient = Patient({
            firstName: _firstName,
            lastName: _lastName,
            patientId: patientId,
            phoneNumber: _phoneNumber,
            age: _age,
            sex: _sex,
            allergies: _allergies,
            height: _height,
            weight: _weight,
            bloodType: _bloodType
        });

        patients[patientId] = newPatient;
        activePatientIds.push(patientId);
        patientExists[patientId] = true;

        emit PatientRegistered(patientId);
    }

    function getPatient(uint256 _patientId) external view onlyExistingPatient(_patientId) returns (Patient memory) {
        return patients[_patientId];
    }

    function getAllPatients() external view returns (Patient[] memory) {
        Patient[] memory allPatients = new Patient[](activePatientIds.length);
        for (uint256 i = 0; i < activePatientIds.length; i++) {
            uint256 patientId = activePatientIds[i];
            allPatients[i] = patients[patientId];
        }
        return allPatients;
    }

    function removePatient(uint256 _patientId) external onlyOwner onlyExistingPatient(_patientId) {
        delete patients[_patientId];
        patientExists[_patientId] = false;

        for (uint256 i = 0; i < activePatientIds.length; i++) {
            if (activePatientIds[i] == _patientId) {
                activePatientIds[i] = activePatientIds[activePatientIds.length - 1];
                activePatientIds.pop();
                break;
            }
        }
    }

    function updatePatient(
        uint256 _patientId,
        string memory _phoneNumber,
        uint256 _age,
        string memory _allergies,
        uint256 _height,
        uint256 _weight
    ) external onlyOwner onlyExistingPatient(_patientId) {
        patients[_patientId].phoneNumber = _phoneNumber;
        patients[_patientId].age = _age;
        patients[_patientId].allergies = _allergies;
        patients[_patientId].height = _height;
        patients[_patientId].weight = _weight;
    }

    function isPatient(uint256 _patientId) external view returns (bool) {
    return patientExists[_patientId];
    }
}
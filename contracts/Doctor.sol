// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Doctors is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _doctorIds;

    struct Doctor {
        uint256 id;
        string firstName;
        string lastName;
        string professionalLicense;
        string specialty;
        string email;
        string phoneNumber;
    }

    mapping(uint256 => Doctor) private doctors;
    mapping(string => bool) private professionalLicenseExists;
    uint256[] private activeDoctorIds;

    event DoctorRegistered(uint256 doctorId, string professionalLicense);

    function registerDoctor(
        string memory _firstName,
        string memory _lastName,
        string memory _professionalLicense,
        string memory _specialty,
        string memory _email,
        string memory _phoneNumber
    ) external onlyOwner {
        require(
            bytes(_professionalLicense).length > 0,
            "Professional license must not be empty"
        );
        require(
            !professionalLicenseExists[_professionalLicense],
            "Doctor already registered"
        );

        _doctorIds.increment(); 
        uint256 doctorId = _doctorIds.current();

        Doctor memory newDoctor = Doctor({
            id: doctorId,
            firstName: _firstName,
            lastName: _lastName,
            professionalLicense: _professionalLicense,
            specialty: _specialty,
            email: _email,
            phoneNumber: _phoneNumber
        });

        doctors[doctorId] = newDoctor;
        activeDoctorIds.push(doctorId);
        professionalLicenseExists[_professionalLicense] = true;

        emit DoctorRegistered(doctorId, _professionalLicense);
    }

    function getDoctor(uint256 _doctorId) external view returns (Doctor memory) {
        require(_doctorId > 0 && _doctorId <= _doctorIds.current(), "Doctor does not exist");
        Doctor memory doctor = doctors[_doctorId];
        require(bytes(doctor.firstName).length > 0, "Doctor does not exist");
        return doctor;
    }

    function getAllDoctors() external view returns (Doctor[] memory) {
        Doctor[] memory allDoctors = new Doctor[](activeDoctorIds.length);
        for (uint256 i = 0; i < activeDoctorIds.length; i++) {
            allDoctors[i] = doctors[activeDoctorIds[i]];
        }
        return allDoctors;
    }

    function removeDoctor(uint256 _doctorId) external onlyOwner {
        require(_doctorId > 0 && _doctorId <= _doctorIds.current(), "Doctor does not exist");

        delete doctors[_doctorId];

        for (uint i = 0; i < activeDoctorIds.length; i++) {
            if (activeDoctorIds[i] == _doctorId) {
                activeDoctorIds[i] = activeDoctorIds[activeDoctorIds.length - 1];
                activeDoctorIds.pop();
                break;
            }
        }
    }

    function updateDoctor(
    uint256 _doctorId,
    string memory _email,
    string memory _phoneNumber
    ) external onlyOwner {
        require(_doctorId > 0 && _doctorId <= _doctorIds.current(), "Doctor does not exist");
        
        doctors[_doctorId].email = _email;
        doctors[_doctorId].phoneNumber = _phoneNumber;
    }

    function isDoctor(uint256 _doctorId) external view returns (bool) {
    return (doctors[_doctorId].id != 0);
    }
}
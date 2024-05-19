function safeStringify(obj) {
    return encodeURIComponent(JSON.stringify(obj));
}

function safeParse(jsonString) {
    return JSON.parse(decodeURIComponent(jsonString));
}

function loadDoctorIds() {
    fetch('http://localhost:3000/doctors')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching doctors');
            }
            return response.json();
        })
        .then(doctors => {
            const doctorSelect = document.getElementById('doctorId');
            doctorSelect.innerHTML = '<option value="">Seleccione un Doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `${doctor.id} - ${doctor.firstName} ${doctor.lastName}`;
                doctorSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching doctors:', error);
            alert('Error fetching doctors');
        });
}

function loadPatientIds() {
    fetch('http://localhost:3000/patients')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching patients');
            }
            return response.json();
        })
        .then(patients => {
            const patientSelect = document.getElementById('patientId');
            patientSelect.innerHTML = '<option value="">Seleccione un Paciente</option>';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.patientId;
                option.textContent = `${patient.patientId} - ${patient.firstName} ${patient.lastName}`;
                patientSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching patients:', error);
            alert('Error fetching patients');
        });
}

function registerPrescription() {
    const doctorId = document.getElementById('doctorId').value;
    const patientId = document.getElementById('patientId').value;
    let medications = document.getElementById('medications').value.trim();

    if (medications && typeof medications === 'string') {
        medications = [medications];
    }

    if (!doctorId || doctorId === "") {
        alert('Por favor, seleccione un doctor.');
        return;
    }

    if (!patientId || patientId === "") {
        alert('Por favor, seleccione un paciente.');
        return;
    }

    if (!medications.length) {
        alert('Por favor, introduzca las medicaciones.');
        return;
    }

    const prescriptionData = { doctorId, patientId, medications };

    fetch('http://localhost:3000/prescriptions/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prescriptionData)
    })
        .then(response => {
            if (response.ok) {
                alert('Receta registrada exitosamente');
            } else {
                throw new Error('Error al registrar la receta');
            }
        })
        .catch(error => {
            console.error('Error al registrar la receta:', error);
            alert(error.message || 'Ocurrió un error al registrar la receta');
        });
}

function fetchAllPrescriptions() {
    fetch('http://localhost:3000/prescriptions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching prescriptions');
            }
            return response.json();
        })
        .then(prescriptions => {
            const tableBody = document.getElementById('prescriptions-table-body');
            tableBody.innerHTML = '';
            prescriptions.forEach(prescription => {
                fetch(`http://localhost:3000/doctors/${prescription.doctorId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error fetching doctor data');
                        }
                        return response.json();
                    })
                    .then(doctor => {
                        fetch(`http://localhost:3000/patients/${prescription.patientId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error fetching patient data');
                                }
                                return response.json();
                            })
                            .then(patient => {
                                const row = `
                        <tr>
                            <td>${prescription.prescriptionId}</td>
                            <td>${doctor.firstName} ${doctor.lastName}</td>
                            <td>${patient.firstName} ${patient.lastName}</td>
                            <td>${prescription.medications}</td>
                            <td>
                                <button class="btn btn-danger" onclick="deletePrescription(${prescription.prescriptionId})">Eliminar</button>
                            </td>
                        </tr>`;
                                tableBody.innerHTML += row;
                            })
                            .catch(error => {
                                console.error('Error fetching patient data:', error);
                                alert('Error fetching patient data');
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching doctor data:', error);
                        alert('Error fetching doctor data');
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching prescriptions:', error);
            alert('Error fetching prescriptions');
        });
}

function fetchPrescriptionById(prescriptionId) {
    fetch(`http://localhost:3000/prescriptions/${prescriptionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching prescription');
            }
            return response.json();
        })
        .then(prescription => {
            fetch(`http://localhost:3000/doctors/${prescription.doctorId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error fetching doctor data');
                    }
                    return response.json();
                })
                .then(doctor => {
                    fetch(`http://localhost:3000/patients/${prescription.patientId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error fetching patient data');
                            }
                            return response.json();
                        })
                        .then(patient => {
                            const cardBody = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Prescripción ID: ${prescription.prescriptionId}</h5>
                            <p class="card-text">Doctor: ${doctor.firstName} ${doctor.lastName}</p>
                            <p class="card-text">Paciente: ${patient.firstName} ${patient.lastName}</p>
                            <p class="card-text">Medicación: ${prescription.medications}</p>
                            <button class="btn btn-danger" onclick="deletePrescription(${prescription.id})">Eliminar</button>
                        </div>
                    </div>`;
                            document.getElementById('prescription-info').innerHTML = cardBody;
                        })
                        .catch(error => {
                            console.error('Error fetching patient data:', error);
                            alert('Error fetching patient data');
                        });
                })
                .catch(error => {
                    console.error('Error fetching doctor data:', error);
                    alert('Error fetching doctor data');
                });
        })
        .catch(error => {
            console.error('Error fetching prescription:', error);
            alert('Error fetching prescription');
        });
}

function fetchPrescriptionsByPatientId(patientId) {
    fetch(`http://localhost:3000/prescriptions/patients/${patientId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching prescriptions');
            }
            return response.json();
        })
        .then(prescriptions => {
            const tableBody = document.getElementById('prescriptions-table-body');
            tableBody.innerHTML = '';
            prescriptions.forEach(prescription => {
                fetch(`http://localhost:3000/doctors/${prescription.doctorId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error fetching doctor data');
                        }
                        return response.json();
                    })
                    .then(doctor => {
                        fetch(`http://localhost:3000/patients/${prescription.patientId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error fetching patient data');
                                }
                                return response.json();
                            })
                            .then(patient => {
                                const row = `
                                    <tr>
                                        <td>${prescription.prescriptionId}</td>
                                        <td>${doctor.firstName} ${doctor.lastName}</td>
                                        <td>${patient.firstName} ${patient.lastName}</td>
                                        <td>${prescription.medications}</td>
                                        <td>
                                            <button class="btn btn-danger" onclick="deletePrescription(${prescription.prescriptionId})">Eliminar</button>
                                        </td>
                                    </tr>`;
                                tableBody.innerHTML += row;
                            })
                            .catch(error => {
                                console.error('Error fetching patient data:', error);
                                alert('Error fetching patient data');
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching doctor data:', error);
                        alert('Error fetching doctor data');
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching prescriptions:', error);
            alert('Error fetching prescriptions');
        });
}

function fetchPrescriptionsByDoctorId(doctorId) {
    fetch(`http://localhost:3000/prescriptions/doctors/${doctorId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching prescriptions');
            }
            return response.json();
        })
        .then(prescriptions => {
            const tableBody = document.getElementById('prescriptions-table-body');
            tableBody.innerHTML = '';
            prescriptions.forEach(prescription => {
                fetch(`http://localhost:3000/patients/${prescription.patientId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error fetching patient data');
                        }
                        return response.json();
                    })
                    .then(patient => {
                        fetch(`http://localhost:3000/doctors/${doctorId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error fetching doctor data');
                                }
                                return response.json();
                            })
                            .then(doctor => {
                                const row = `
                                    <tr>
                                        <td>${prescription.prescriptionId}</td>
                                        <td>${doctor.firstName} ${doctor.lastName}</td>
                                        <td>${patient.firstName} ${patient.lastName}</td>
                                        <td>${prescription.medications}</td>
                                        <td>
                                            <button class="btn btn-danger" onclick="deletePrescription(${prescription.prescriptionId})">Eliminar</button>
                                        </td>
                                    </tr>`;
                                tableBody.innerHTML += row;
                            })
                            .catch(error => {
                                console.error('Error fetching doctor data:', error);
                                alert('Error fetching doctor data');
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching patient data:', error);
                        alert('Error fetching patient data');
                    });
            });
        })
        .catch(error => {
            console.error('Error fetching prescriptions:', error);
            alert('Error fetching prescriptions');
        });
}

function deletePrescription(prescriptionId) {
    fetch(`http://localhost:3000/prescriptions/remove/${prescriptionId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting prescription');
            }
            alert('Prescripción eliminada exitosamente');
            fetchAllPrescriptions();
        })
        .catch(error => {
            console.error('Error al eliminar la prescripción:', error);
            alert('Error al eliminar la prescripción');
        });
}
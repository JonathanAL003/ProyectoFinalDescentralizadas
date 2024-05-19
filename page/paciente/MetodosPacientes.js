function registerPatient() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const age = document.getElementById('age').value.trim();
    const sex = document.getElementById('sex').value.trim();
    const allergies = document.getElementById('allergies').value.trim();
    const height = document.getElementById('height').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const bloodType = document.getElementById('bloodType').value.trim();

    if (!firstName || !lastName || !phoneNumber || !age || !sex || !allergies || !height || !weight || !bloodType) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
    }

    const patientData = {
        firstName,
        lastName,
        phoneNumber,
        age,
        sex,
        allergies,
        height,
        weight,
        bloodType
    };

    fetch('http://localhost:3000/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
    })
        .then(response => {
            if (response.ok) {
                alert('Paciente registrado exitosamente');
            } else {
                throw new Error('Error al registrar al paciente');
            }
        })
        .catch(error => {
            console.error('Error al registrar al paciente:', error);
            alert(error.message || 'Ocurrió un error al registrar al paciente');
        });
}

function getPatientById() {
    const patientId = document.getElementById('search-id').value.trim();

    if (!patientId) {
        alert('Por favor, ingrese el ID del paciente.');
        return;
    }

    fetch(`http://localhost:3000/patients/${patientId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Paciente no encontrado');
            }
        })
        .then(data => {
            displayPatientInfo(data);
        })
        .catch(error => {
            console.error('Error al obtener el paciente:', error);
            document.getElementById('patient-info').innerHTML = `<p>${error.message || 'Error al obtener el paciente'}</p>`;
        });
}

function getAllPatients() {
    fetch('http://localhost:3000/patients')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la lista de pacientes');
            }
            return response.json();
        })
        .then(data => {
            fetchAllPatients(data);
        })
        .catch(error => {
            console.error('Error al obtener la lista de pacientes:', error);
            alert(error.message || 'Ocurrió un error al obtener la lista de pacientes');
        });
}

function updatePatient() {
    const patientId = document.getElementById('id').value.trim();
    const updatedData = {
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        age: document.getElementById('age').value.trim(),
        allergies: document.getElementById('allergies').value.trim(),
        height: document.getElementById('height').value.trim(),
        weight: document.getElementById('weight').value.trim()
    };

    fetch(`http://localhost:3000/patients/${patientId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
        .then(response => {
            if (response.ok) {
                alert('Paciente actualizado exitosamente');
            } else {
                throw new Error('Error al actualizar paciente');
            }
        })
        .catch(error => {
            console.error('Error al actualizar paciente:', error);
            alert(error.message || 'Ocurrió un error al actualizar paciente');
        });
}

function deletePatient(patientId) {
    if (!confirm('¿Está seguro de querer eliminar este paciente?')) return;

    fetch(`http://localhost:3000/patients/${patientId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                alert('Paciente eliminado correctamente');
            } else {
                throw new Error('Error al eliminar paciente');
            }
        })
        .catch(error => {
            console.error('Error al eliminar paciente:', error);
            alert(error.message || 'Ocurrió un error al eliminar paciente');
        });
}

function displayPatientInfo(patient) {
    const patientInfo = document.getElementById('patient-info');
    patientInfo.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${patient.firstName} ${patient.lastName}</h5>
                <p class="card-text">Teléfono: ${patient.phoneNumber}</p>
                <p class="card-text">Edad: ${patient.age}</p>
                <p class="card-text">Sexo: ${patient.sex}</p>
                <p class="card-text">Alergias: ${patient.allergies}</p>
                <p class="card-text">Estatura: ${patient.height} cm</p>
                <p class="card-text">Peso: ${patient.weight} kg</p>
                <p class="card-text">Tipo de Sangre: ${patient.bloodType}</p>
                <button class="btn btn-primary" onclick='populateUpdateForm("${safeStringify(patient)}")'>Actualizar</button>
                <button class="btn btn-danger" onclick="deletePatient('${patient.patientId}')">Eliminar</button>
            </div>
        </div>`;
}

function safeStringify(obj) {
    return encodeURIComponent(JSON.stringify(obj));
}

function safeParse(jsonString) {
    return JSON.parse(decodeURIComponent(jsonString));
}

function fetchAllPatients() {
    fetch('http://localhost:3000/patients')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching patients');
            }
            return response.json();
        })
        .then(patients => {
            const tableBody = document.getElementById('patients-table-body');
            tableBody.innerHTML = '';
            patients.forEach(patient => {
                const row = `<tr>
                    <td>${patient.patientId}</td>
                    <td>${patient.firstName}</td>
                    <td>${patient.lastName}</td>
                    <td>${patient.age}</td>
                    <td>${patient.sex}</td>
                    <td>${patient.phoneNumber}</td>
                    <td>${patient.allergies}</td>
                    <td>${patient.height}</td>
                    <td>${patient.weight}</td>
                    <td>${patient.bloodType}</td>
                    <td>
                        <button class="btn btn-primary" onclick='populateUpdateForm("${safeStringify(patient)}")'>Actualizar</button>
                        <button class="btn btn-danger" onclick="deletePatient('${patient.patientId}')">Eliminar</button>
                    </td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching patients:', error);
            alert(error.message || 'Ocurrió un error al obtener los pacientes');
        });
}

function populateUpdateForm(patientString) {
    const patient = safeParse(patientString);
    loadContent('paciente/update-patient.html', 'main', () => {
        document.getElementById('id').value = patient.patientId;
        document.getElementById('firstName').value = patient.firstName;
        document.getElementById('lastName').value = patient.lastName;
        document.getElementById('age').value = patient.age;
        document.getElementById('sex').value = patient.sex;
        document.getElementById('phoneNumber').value = patient.phoneNumber;
        document.getElementById('allergies').value = patient.allergies;
        document.getElementById('height').value = patient.height;
        document.getElementById('weight').value = patient.weight;
        document.getElementById('bloodType').value = patient.bloodType;
    })
        .then(() => {
            console.log('Contenido cargado exitosamente');
        })
        .catch(error => {
            console.error('Error al cargar el contenido:', error);
            alert(error.message || 'Ocurrió un error al cargar el contenido');
        });
}
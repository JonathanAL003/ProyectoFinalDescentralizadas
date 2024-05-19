function registerDoctor() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const professionalLicense = document.getElementById('professionalLicense').value.trim();
    const specialty = document.getElementById('specialty').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();

    if (!firstName || !lastName || !professionalLicense || !specialty || !email || !phoneNumber) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const doctorData = {
        firstName: firstName,
        lastName: lastName,
        professionalLicense: professionalLicense,
        specialty: specialty,
        email: email,
        phoneNumber: phoneNumber,
    };

    fetch('http://localhost:3000/doctors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctorData)
    })
        .then(response => {
            if (response.ok) {
                alert('Doctor registrado exitosamente');
                document.getElementById('register-doctor-form').reset();
            } else {
                alert('Error al registrar el doctor');
            }
        })
        .catch(error => {
            console.error('Error al registrar el doctor:', error);
        });
}

function searchDoctorById() {
    const doctorId = document.getElementById('search-id').value;

    if (!doctorId.trim()) {
        alert('Por favor, ingrese el ID del doctor.');
        return;
    }

    fetch(`http://localhost:3000/doctors/${doctorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Doctor no encontrado');
            }
        })
        .then(data => {
            displayDoctorInfo(data);
        })
        .catch(error => {
            document.getElementById('doctor-info').innerHTML = `<p>${error.message}</p>`;
        });
}

function getAllDoctors() {
    fetch('http://localhost:3000/doctors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            displayDoctors(data);
        })
        .catch(error => {
            console.error('Error al obtener la lista de doctores:', error);
        });
}

function updateDoctor() {
    const doctorId = document.getElementById('id').value;
    const updatedData = {
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
    };

    fetch(`http://localhost:3000/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
        .then(response => {
            if (response.ok) {
                alert('Doctor actualizado exitosamente');
            } else {
                alert('Error al actualizar el doctor');
            }
        })
        .catch(error => {
            console.error('Error al actualizar el doctor:', error);
        });
}

function deleteDoctor(doctorId) {
    fetch(`http://localhost:3000/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            getAllDoctors();
        })
        .catch(error => {
            console.error('Error al eliminar el doctor:', error);
        });
}

function safeStringify(obj) {
    return encodeURIComponent(JSON.stringify(obj));
}

function safeParse(jsonString) {
    return JSON.parse(decodeURIComponent(jsonString));
}

function displayDoctorInfo(doctor) {
    const doctorInfo = document.getElementById('doctor-info');
    doctorInfo.innerHTML = '';

    if (doctor) {
        const fullName = `${doctor.firstName} ${doctor.lastName}`;
        const doctorDetails = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${fullName}</h5>
                        <p class="card-text">ID: ${doctor.id}</p>
                        <p class="card-text">Licencia Profesional: ${doctor.professionalLicense}</p>
                        <p class="card-text">Especialidad: ${doctor.specialty}</p>
                        <p class="card-text">Teléfono: ${doctor.phoneNumber}</p>
                        <p class="card-text">Email: ${doctor.email}</p>
                        <button class="btn btn-primary" onclick='loadUpdateDoctorPage("${safeStringify(doctor)}")'>Actualizar</button>
                        <button class="btn btn-danger" onclick="deleteDoctor(${doctor.id})">Eliminar</button>
                    </div>
                </div>
            `;
        doctorInfo.innerHTML = doctorDetails;
    } else {
        doctorInfo.innerHTML = '<p>Doctor no encontrado.</p>';
    }
}

function loadUpdateDoctorPage(doctorString) {
    const doctor = safeParse(doctorString);
    loadContent('doctor/update-doctor.html', 'main', () => {
        document.getElementById('id').value = doctor.id;
        document.getElementById('firstName').value = doctor.firstName;
        document.getElementById('lastName').value = doctor.lastName;
        document.getElementById('professionalLicense').value = doctor.professionalLicense;
        document.getElementById('specialty').value = doctor.specialty;
        document.getElementById('email').value = doctor.email;
        document.getElementById('phoneNumber').value = doctor.phoneNumber;

        document.getElementById('firstName').disabled = true;
        document.getElementById('lastName').disabled = true;
        document.getElementById('professionalLicense').disabled = true;
        document.getElementById('specialty').disabled = true;
    });
}

function displayDoctors(doctors) {
    const doctorsList = document.getElementById('doctors-list');
    doctorsList.innerHTML = '';

    if (doctors.length === 0) {
        doctorsList.innerHTML = '<p>No se encontraron doctores.</p>';
    } else {
        const table = document.createElement('table');
        table.classList.add('table', 'table-striped');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['ID', 'Nombre', 'Licencia', 'Especialidad', 'Teléfono', 'Email', 'Acciones'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            const fullName = `${doctor.firstName} ${doctor.lastName}`;

            const cellID = document.createElement('td');
            cellID.textContent = doctor.id;
            row.appendChild(cellID);

            const cellName = document.createElement('td');
            cellName.textContent = fullName;
            row.appendChild(cellName);

            const cellLicense = document.createElement('td');
            cellLicense.textContent = doctor.professionalLicense;
            row.appendChild(cellLicense);

            const cellSpecialty = document.createElement('td');
            cellSpecialty.textContent = doctor.specialty;
            row.appendChild(cellSpecialty);

            const cellPhone = document.createElement('td');
            cellPhone.textContent = doctor.phoneNumber;
            row.appendChild(cellPhone);

            const cellEmail = document.createElement('td');
            cellEmail.textContent = doctor.email;
            row.appendChild(cellEmail);

            const cellActions = document.createElement('td');

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Actualizar';
            updateButton.classList.add('btn', 'btn-primary', 'mr-2');
            updateButton.onclick = () => loadUpdateDoctorPage(doctor);
            cellActions.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.onclick = () => deleteDoctor(doctor.id);
            cellActions.appendChild(deleteButton);

            row.appendChild(cellActions);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        doctorsList.appendChild(table);
    }

    function loadUpdateDoctorPage(doctor) {
        loadContent('doctor/update-doctor.html', 'main', () => {
            document.getElementById('id').value = doctor.id;
            document.getElementById('firstName').value = doctor.firstName;
            document.getElementById('lastName').value = doctor.lastName;
            document.getElementById('professionalLicense').value = doctor.professionalLicense;
            document.getElementById('specialty').value = doctor.specialty;
            document.getElementById('email').value = doctor.email;
            document.getElementById('phoneNumber').value = doctor.phoneNumber;

            document.getElementById('firstName').disabled = true;
            document.getElementById('lastName').disabled = true;
            document.getElementById('professionalLicense').disabled = true;
            document.getElementById('specialty').disabled = true;
        });
    }
}
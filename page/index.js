function loadContent(url, elementId, callback) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el contenido');
                }
                return response.text();
            })
            .then(html => {
                document.getElementById(elementId).innerHTML = html;
                if (callback) {
                    callback();
                }
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    });
}

function loadPageContent(page, event) {
    event.preventDefault();
    const urlMap = {
        "home": {
            "sidebar": "sidebar.html",
            "main": "main.html",
            "header": "Página Principal"
        },
        "doctores": {
            "sidebar": "doctor/sidebar-doctor.html",
            "main": "doctor/main-doctores.html",
            "header": "Doctores"
        },
        "pacientes": {
            "sidebar": "paciente/sidebar-paciente.html",
            "main": "paciente/main-pacientes.html",
            "header": "Pacientes"
        },
        "recetas": {
            "sidebar": "receta/sidebar-receta.html",
            "main": "receta/main-recetas.html",
            "header": "Recetas"
        }
    };

    if (urlMap[page]) {
        document.getElementById("page-info").innerText = urlMap[page].header;
        loadContent(urlMap[page].sidebar, "sidebar");
        loadContent(urlMap[page].main, "main");
    }
}

function loadPageContentSidebar(page, event) {
    event.preventDefault();
    const urlMap = {
        "register-doctor": {
            "sidebar": "doctor/sidebar-doctor.html",
            "main": "doctor/register-doctor.html",
            "header": "Doctores"
        },
        "get-all-doctors": {
            "sidebar": "doctor/sidebar-doctor.html",
            "main": "doctor/get-all-doctors.html",
            "header": "Doctores"
        },
        "get-doctor-by-id": {
            "sidebar": "doctor/sidebar-doctor.html",
            "main": "doctor/get-doctor-by-id.html",
            "header": "Doctores"
        },
        "register-patient": {
            "sidebar": "paciente/sidebar-paciente.html",
            "main": "paciente/register-patient.html",
            "header": "Pacientes"
        },
        "get-patiend-by-id": {
            "sidebar": "paciente/sidebar-paciente.html",
            "main": "paciente/get-patient-by-id.html",
            "header": "Pacientes"
        },
        "get-all-patients": {
            "sidebar": "paciente/sidebar-paciente.html",
            "main": "paciente/get-all-patients.html",
            "header": "Pacientes"
        },
        "register-prescription": {
            "sidebar": "receta/sidebar-receta.html",
            "main": "receta/register-prescription.html",
            "header": "Recetas"
        },
        "get-prescription-by-id": {
            "sidebar": "receta/sidebar-receta.html",
            "main": "receta/get-prescription-by-id.html",
            "header": "Recetas"
        },
        "get-all-prescriptions": {
            "sidebar": "receta/sidebar-receta.html",
            "main": "receta/get-all-prescriptions.html",
            "header": "Recetas"
        },
        "get-all-prescriptions-by-doctor": {
            "sidebar": "receta/sidebar-receta.html",
            "main": "receta/get-all-prescriptions-by-doctor.html",
            "header": "Recetas"
        },
        "get-all-prescriptions-by-patient": {
            "sidebar": "receta/sidebar-receta.html",
            "main": "receta/get-all-prescriptions-by-patient.html",
            "header": "Recetas"
        }
    };

    if (urlMap[page]) {
        document.getElementById("page-info").innerText = urlMap[page].header;
        loadContent(urlMap[page].sidebar, "sidebar");
        loadContent(urlMap[page].main, "main");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadContent("header.html", "header");
    loadContent("sidebar.html", "sidebar");
    loadContent("prefooter.html", "prefooter");
    loadContent("main.html", "main", function () {
        const sidebar1 = document.getElementById("sidebar1");
        const sidebar2 = document.getElementById("sidebar2");
        const buttons = sidebar1.querySelectorAll('.btn-sidebar');

        buttons.forEach(button => {
            button.addEventListener("click", function () {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const target = this.getAttribute("data-target");
                updateSidebar2(target, sidebar2);
                const url = this.getAttribute("href");
                updateMain(url);
            });
        });

        buttons[0].click();
    });
});

function updateMain(url) {
    if (url) {
        loadContent(url, "main");
    }
}

function updateSidebar2(target, sidebar2) {
    sidebar2.innerHTML = "";
    switch (target) {
        case "doctores":
            sidebar2.innerHTML += `
                <a href="#" onclick="loadPageContentSidebar('register-doctor', event)">Registrar Doctor</a>
                <a href="#" onclick="loadPageContentSidebar('get-doctor-by-id', event)">Obtener Doctor por ID</a>
                <a href="#" onclick="loadPageContentSidebar('get-all-doctors', event)">Obtener todos los Doctores</a>
            `;
            break;
        case "pacientes":
            sidebar2.innerHTML += `
                <a href="#" onclick="loadPageContentSidebar('register-patient', event)">Registrar Paciente</a>
                <a href="#" onclick="loadPageContentSidebar('get-patiend-by-id', event)">Obtener Paciente por Id</a>
                <a href="#" onclick="loadPageContentSidebar('get-all-patients', event)">Obtener todos los Pacientes</a>
            `;
            break;
        case "recetas":
            sidebar2.innerHTML += `
            <a href="#" onclick="loadPageContentSidebar('register-prescription', event)">Registrar Receta</a>
            <a href="#" onclick="loadPageContentSidebar('get-all-prescriptions', event)">Traer todas las Recetas</a>
            <a href="#" onclick="loadPageContentSidebar('get-prescription-by-id', event)">Traer receta por Id</a>
            <a href="#" onclick="loadPageContentSidebar('get-all-prescriptions-by-doctor', event)">Traer todas las recetas del doctor</a>
            <a href="#" onclick="loadPageContentSidebar('get-all-prescriptions-by-patient', event)">Traer todas las recetas del paciente</a>
            `;
            break;
    }
}
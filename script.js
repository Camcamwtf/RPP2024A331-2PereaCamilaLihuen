let personas = JSON.parse('[{"id":1, "nombre":"Marcelo", "apellido":"Luque", "edad":45, "titulo":"Ingeniero", "facultad":"UTN","añoGraduacion":2002},{"id":2, "nombre":"Ramiro", "apellido":"Escobar", "edad":35, "titulo":"Medico","facultad":"UBA", "añoGraduacion":2012},{"id":3, "nombre":"Facundo", "apellido":"Cairo", "edad":30,"titulo":"Abogado", "facultad":"UCA", "añoGraduacion":2017},{"id":4, "nombre":"Fernando", "apellido":"Nieto","edad":18, "equipo":"Independiente", "posicion":"Delantero", "cantidadGoles":7},{"id":5, "nombre":"Manuel","apellido":"Loza", "edad":20, "equipo":"Racing", "posicion":"Volante", "cantidadGoles":2},{"id":6,"nombre":"Nicolas", "apellido":"Serrano", "edad":23, "equipo":"Boca", "posicion":"Arquero", "cantidadGoles":0}]');
let personaEditando = null;

function mostrarDatos() {
    const tbody = document.querySelector("#tabla-personas tbody");
    tbody.innerHTML = '';
    document.getElementById("filter").value = "todos";

    personas.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.id || '--'}</td>
            <td>${p.nombre || '--'}</td>
            <td>${p.apellido || '--'}</td>
            <td>${p.edad || '--'}</td>
            <td>${p.equipo || '--'}</td>
            <td>${p.posicion || '--'}</td>
            <td>${p.cantidadGoles || '--'}</td>
            <td>${p.titulo || '--'}</td>
            <td>${p.facultad || '--'}</td>
            <td>${p.añoGraduacion || '--'}</td>`;
        row.ondblclick = () => mostrarABM(p);
        tbody.appendChild(row);
    });

    mostrarColumnas();
}

function filtrarDatos() {
    const filtro = document.getElementById("filter").value;
    let filtrados = personas;

    if (filtro === 'futbolistas') {
        filtrados = personas.filter(p => p.equipo);
    } else if (filtro === 'profesionales') {
        filtrados = personas.filter(p => p.titulo);
    }

    mostrarDatosFiltrados(filtrados);
}

function mostrarDatosFiltrados(lista) {
    const tbody = document.querySelector("#tabla-personas tbody");
    tbody.innerHTML = '';
    lista.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${p.id || '--'}</td>
            <td>${p.nombre || '--'}</td>
            <td>${p.apellido || '--'}</td>
            <td>${p.edad || '--'}</td>
            <td>${p.equipo || '--'}</td>
            <td>${p.posicion || '--'}</td>
            <td>${p.cantidadGoles || '--'}</td>
            <td>${p.titulo || '--'}</td>
            <td>${p.facultad || '--'}</td>
            <td>${p.añoGraduacion || '--'}</td>`;
        row.ondblclick = () => mostrarABM(p);
        tbody.appendChild(row);
    });

    mostrarColumnas();
}

function calcularEdadPromedio() {
    const filtro = document.getElementById("filter").value;
    let filtrados = personas;
    if (filtro === 'futbolistas') {
        filtrados = personas.filter(p => p.equipo);
    } else if (filtro === 'profesionales') {
        filtrados = personas.filter(p => p.titulo);
    }
    const promedio = filtrados.reduce((acc, p) => acc + p.edad, 0) / filtrados.length;
    document.getElementById("edad-promedio").value = `${promedio.toFixed(2)}`;
}

function mostrarABM(persona = {}) {
    document.getElementById("form-datos").style.display = "none";
    document.getElementById("form-abm").style.display = "block";
    personaEditando = persona.id;
    document.getElementById("id").value = persona.id || '';
    document.getElementById("nombre").value = persona.nombre || '';
    document.getElementById("apellido").value = persona.apellido || '';
    document.getElementById("edad").value = persona.edad || '';
    document.getElementById("equipo").value = persona.equipo || '';
    document.getElementById("posicion").value = persona.posicion || '';
    document.getElementById("cantidadGoles").value = persona.cantidadGoles != null ? persona.cantidadGoles : 0;
    document.getElementById("titulo").value = persona.titulo || '';
    document.getElementById("facultad").value = persona.facultad || '';
    document.getElementById("añoGraduacion").value = persona.añoGraduacion || '';

    if (persona.equipo) {
        document.getElementById("tipo").value = 'tipo_futbolistas';
    } else if (persona.titulo) {
        document.getElementById("tipo").value = 'tipo_profesionales';
    } else {
        document.getElementById("tipo").value = 'tipo_futbolistas';
    }

    mostrarCamposPorTipo();
}

function guardarPersona() {
    const id = personaEditando || (personas.length ? Math.max(...personas.map(p => p.id)) + 1 : 1);
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const edad = parseInt(document.getElementById("edad").value);
    const tipo = document.getElementById("tipo").value;
    const equipo = document.getElementById("equipo").value;
    const posicion = document.getElementById("posicion").value;
    const cantidadGoles = parseInt(document.getElementById("cantidadGoles").value) || 0;
    const titulo = document.getElementById("titulo").value;
    const facultad = document.getElementById("facultad").value;
    const añoGraduacion = parseInt(document.getElementById("añoGraduacion").value) || null;
    const existeJugador = personas.some(p => p.id === id);
    
    if (existeJugador) {
        alert("La persona ingresada ya existe. Presione 'Modificar' para guardar los cambios.");
        return;
    }

    if (!nombre) {
        alert("El campo 'Nombre' es requerido.");
        return;
    } else if (!apellido) {
        alert("El campo 'Apellido' es requerido.");
        return;
    } else if (isNaN(edad) || edad < 15) {
        alert("El campo 'Edad' es requerido.");
        return;
    } else if (tipo === 'tipo_futbolistas' && equipo.trim() === '') {
        alert("Necesita indicar un equipo para el futbolista seleccionado.");
        return;
    } else if (tipo === 'tipo_profesionales' && titulo.trim() === '') {
        alert("Necesita indicar un título para el profesional seleccionado.");
        return;
    }

    const nuevaPersona = { id, nombre, apellido, edad, equipo, posicion, cantidadGoles, titulo, facultad, añoGraduacion, tipo };
    
    if (personaEditando) {
        personas = personas.map(p => p.id === personaEditando ? nuevaPersona : p);
    } else {
        personas.push(nuevaPersona);
    }

    cancelarABM();
    mostrarDatos();
}

function modificarPersona() {
    const id = personaEditando;

    if (!id) {
        alert("La persona ingresada no existe. Presione 'Alta' para continuar.");
        return;
    }

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const edad = parseInt(document.getElementById("edad").value);
    const equipo = document.getElementById("equipo").value;
    const posicion = document.getElementById("posicion").value;
    const cantidadGoles = parseInt(document.getElementById("cantidadGoles").value) || 0;
    const titulo = document.getElementById("titulo").value;
    const facultad = document.getElementById("facultad").value;
    const añoGraduacion = parseInt(document.getElementById("añoGraduacion").value) || null;
    const tipo = document.getElementById("tipo").value;
    const personaExistente = personas.find(p => p.id === id);

    if (!personaExistente) {
        alert("La persona ingresada no existe. Presione 'Alta' para continuar.");
        return;
    }

    personaExistente.nombre = nombre;
    personaExistente.apellido = apellido;
    personaExistente.edad = edad;
    personaExistente.equipo = equipo;
    personaExistente.posicion = posicion;
    personaExistente.cantidadGoles = cantidadGoles;
    personaExistente.titulo = titulo;
    personaExistente.facultad = facultad;
    personaExistente.añoGraduacion = añoGraduacion;
    personaExistente.tipo = tipo;

    cancelarABM();
    mostrarDatos();
}

function eliminarPersona() {
    if (!personaEditando) {
        cancelarABM();
        return;
    }

    personas = personas.filter(p => p.id !== personaEditando);
    personaEditando = null;

    mostrarDatos();
    cancelarABM();
}

function cancelarABM() {
    document.getElementById("form-abm").style.display = "none";
    document.getElementById("form-datos").style.display = "block";
}

function ordenarTabla(columna) {
    personas.sort((a, b) => (a[columna] > b[columna]) ? 1 : -1);
    mostrarDatos();
}

function mostrarColumnas() {
    const checkboxes = document.querySelectorAll('[data-column]');
    checkboxes.forEach(cb => {
        const columnName = cb.dataset.column;
        const columnIndex = Array.from(document.querySelectorAll("#tabla-personas th"))
            .findIndex(th => th.getAttribute("onclick")?.includes(columnName));
        if (columnIndex !== -1) {
            const displayStyle = cb.checked ? '' : 'none';
            document.querySelectorAll(`#tabla-personas th`)[columnIndex].style.display = displayStyle;
            document.querySelectorAll(`#tabla-personas tbody tr`).forEach(row => {
                if (row.cells[columnIndex]) {
                    row.cells[columnIndex].style.display = displayStyle;
                }
            });
        }
    });
}

function mostrarCamposPorTipo() {
    const tipo = document.getElementById("tipo").value;
    const camposFutbolista = ['equipo', 'posicion', 'cantidadGoles'];
    const camposProfesional = ['titulo', 'facultad', 'añoGraduacion'];

    camposFutbolista.concat(camposProfesional).map(id => {
        document.getElementById(id).style.display = 'inline-block';
        document.querySelector(`label[for="${id}"]`).style.display = 'inline-block';
    });

    if (tipo === 'tipo_futbolistas') {
        camposProfesional.map(id => {
            document.getElementById(id).style.display = 'none';
            document.querySelector(`label[for="${id}"]`).style.display = 'none';
        });
    } else if (tipo === 'tipo_profesionales') {
        camposFutbolista.map(id => {
            document.getElementById(id).style.display = 'none';
            document.querySelector(`label[for="${id}"]`).style.display = 'none';
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarDatos();
    filtrarDatos();
});

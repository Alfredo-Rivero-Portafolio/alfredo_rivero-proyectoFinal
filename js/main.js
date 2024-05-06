// Array donde se guardarán los estudiantes
let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];

// Si estudiantes no es un array, inicialízalo como un array vacío
if (!Array.isArray(estudiantes)) {
   estudiantes = [];
}

// Función para guardar los datos del estudiante del formulario
function guardarDatos() {
   let grado = document.querySelector("#grado").value;
   let dni = document.querySelector("#dni").value.trim();
   let nombre = document.querySelector("#nombre").value.trim();
   let apellido = document.querySelector("#apellido").value.trim();
   let materia = document.querySelector("#materia").value;
   let nota1 = parseInt(document.querySelector("#nota1").value);
   let nota2 = parseInt(document.querySelector("#nota2").value);
   let nota3 = parseInt(document.querySelector("#nota3").value);
   let nota4 = parseInt(document.querySelector("#nota4").value);
   let nota5 = parseInt(document.querySelector("#nota5").value);

   if (dni.length !== 8) {
      Toastify({
         text: "Complete el DNI",
         style: {
            background: "linear-gradient(to right, #6b9bbd, #bdb76c8a)",
            color: "#000000",
            padding: "10px",
            margintop: "20px",
            border: "5px",
         },
         duration: 1000
      }).showToast();
      return;
   }
   if (nombre === "" ) {
      Toastify({
         text: "Complete el Nombre",
         style: {
            background: "linear-gradient(to right, #6b9bbd, #bdb76c8a)",
            color: "#000000",
            padding: "10px",
            margintop: "20px",
            border: "5px",
         },
         duration: 1000
      }).showToast()
      return;
   }
   if (apellido === "") {
      Toastify({
         text: "Complete el Apellido",
         style: {
            background: "linear-gradient(to right, #6b9bbd, #bdb76c8a)",
            color: "#000000",
            padding: "10px",
            margintop: "20px",
            border: "5px",
         },
         duration: 1000
      }).showToast()
      return;
   }

   // Verificar que las notas estén en el rango correcto
   if (validarNotas([nota1, nota2, nota3, nota4, nota5])) {

      // Calcular promedio
      let promedio = calcularPromedio(nota1, nota2, nota3, nota4, nota5);

      // Crear objeto estudiante
      let estudiante = {
         grado: grado,
         dni: dni,
         nombre: nombre,
         apellido: apellido,
         materia: materia,
         promedio: promedio,
      };

      // Agregar estudiante al array
      estudiantes.push(estudiante);

      // Convirte el array de estudiantes a cadena JSON y guardar en localStorage
      localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

      // Limpiar formulario
      limpiarFormulario();

      // Preguntar si desea agregar otro estudiante
      Swal.fire({
         title: '¿Desea agregar otro estudiante?',
         icon: 'question',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Sí',
         cancelButtonText: 'No'
      }).then((result) => {
         if (!result.isConfirmed) {
            const Toast = Swal.mixin({
               toast: true,
               position: "top-end",
               showConfirmButton: false,
               timer: 2000,
               timerProgressBar: true,
               didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
               }
            });

            Toast.fire({
               icon: "success",
               title: "Registro Exitoso !!!"
            });
         }
      });
      mostrarEstudiantes();
   }
}


function limitarCaracteresDni(e) {
   // Reemplazamos cualquier carácter no numérico por una cadena vacía
   e.value = e.value.replace(/\D/g, "");

   // Limitamos la cantidad máxima de caracteres a 8
   if (e.value.length > 8) {
      e.value = e.value.slice(0, 8);
   }
}

// Función para validar que las notas estén en el rango correcto
function validarNotas(notas) {
   for (let i = 0; i < notas.length; i++) {
      if (isNaN(notas[i]) || notas[i] < 0 || notas[i] > 10) {
         return false;
      }
   }
   return true;
}

// Función para calcular el promedio de notas
function calcularPromedio(nota1, nota2, nota3, nota4, nota5) {
   let suma = nota1 + nota2 + nota3 + nota4 + nota5;
   return suma / 5;
}

// Función para limpiar el formulario
function limpiarFormulario() {
   document.querySelector("#formulario").reset();
}

// Función para calcular el estado del estudiante (aprobado o reprobado)
function calcularEstado(promedio) {
   return promedio >= 5 ? "Aprobado" : "Reprobado";
}

// Variable para almacenar los ID de los estudiantes ya mostrados
let estudiantesMostrados = new Set();

// Función para mostrar los estudiantes
function mostrarEstudiantes() {
   let tabla = document.querySelector("#tablaEstudiantes");

   // Si la tabla no existe, la creamos
   if (!tabla) {
      tabla = document.createElement("table");
      tabla.setAttribute("id", "tablaEstudiantes");

      // Encabezados de la tabla
      tabla.innerHTML = `
            <tr>
               <th>Grado</th>
               <th>DNI</th>
               <th>Nombre</th>
               <th>Apellido</th>
               <th>Materia</th>
               <th>Promedio</th>
               <th>Estado</th>
            </tr>`;

      document.body.appendChild(tabla);
   }
   // Filtramos los estudiantes que aún no han sido mostrados
   let estudiantesNuevos = estudiantes.filter(
      (estudiante) => !estudiantesMostrados.has(estudiante.dni)
   );

   // Agregamos los estudiantes nuevos a la tabla
   estudiantesNuevos.forEach((estudiante) => {
      let estado = calcularEstado(estudiante.promedio);
      let fila = `
            <tr>
               <td class='celda'>${estudiante.grado} año</td>
               <td class='celda'>${estudiante.dni}</td>
               <td class='celda'>${estudiante.nombre}</td>
               <td class='celda'>${estudiante.apellido}</td>
               <td class='celda'>${estudiante.materia}</td>
               <td class='celda'>${estudiante.promedio.toFixed(1)}</td>
               <td class='celda'>${estado}</td>
            </tr>`;
      tabla.innerHTML += fila;

      // Añadimos el ID del estudiante mostrado 
      estudiantesMostrados.add(estudiante.dni);
   });
}


function buscarEstudiantePorDNI() {
   // Obtener el DNI ingresado por el usuario
   const dni = document.querySelector("#inputDNI").value;

   // Obtener los datos de estudiantes almacenados en localStorage
   let estudiantesLocalStorage = JSON.parse(localStorage.getItem("estudiantes")) || [];

   // Obtener los datos de estudiantes del archivo JSON
   fetch("/json/alumnos.json")
      .then(response => response.json())
      .then(estudiantesJSON => {
         // Filtrar los estudiantes del archivo JSON que coinciden con el DNI ingresado
         const estudiantesFiltradosJSON = estudiantesJSON.filter(
            estudiante => estudiante.dni === dni
         );

         // Filtrar los estudiantes almacenados en localStorage que coinciden con el DNI ingresado
         const estudiantesFiltradosLocalStorage = estudiantesLocalStorage.filter(
            estudiante => estudiante.dni === dni
         );

         // Combinar los resultados de ambas búsquedas
         const estudiantesFiltrados = estudiantesFiltradosJSON.concat(estudiantesFiltradosLocalStorage);

         // Mostrar los datos de los estudiantes filtrados en una tabla HTML
         if (estudiantesFiltrados.length > 0) {
            mostrarDatosEstudiante(estudiantesFiltrados);
         } else {
            // Mostrar un mensaje si no se encuentra ningún estudiante con ese DNI
            Swal.fire({
               title: "DNI no encontrado!",
               text: "Verifique el número e inténtelo de nuevo.",
               icon: "warning"
            });
         }
      })
      .catch(error => {
         // Manejar cualquier error de la solicitud
         console.error("Error al buscar estudiante por DNI:", error);
         // Mostrar un mensaje de error
         Swal.fire({
            title: "Error",
            text: "Ocurrió un error al buscar el estudiante por DNI. Por favor, inténtelo de nuevo.",
            icon: "error"
         });
      });
}


// Función para mostrar los datos del estudiante en una tabla HTML
function mostrarDatosEstudiante(estudiantesFiltrados) {
   const tablaAnterior = document.querySelector("#tablaEstudiante");
   if (tablaAnterior) {
      tablaAnterior.remove();
   }

   // Creamos la estructura de la tabla
   const tabla = document.createElement("table");
   tabla.id = "tablaEstudiante";
   const thead = document.createElement("thead");
   thead.innerHTML = `
      <tr>
         <th>Dni</th>
         <th>Nombre</th>
         <th>Apellido</th>
         <th>Materia</th>
         <th>Promedio</th>
      </tr>
   `;
   const tbody = document.createElement("tbody");

   // Iteramos sobre cada estudiante y creamos una fila para cada uno
   estudiantesFiltrados.forEach((estudiante) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
      <td>${estudiante.dni}</td>
      <td>${estudiante.nombre}</td>
      <td>${estudiante.apellido}</td>
      <td>${estudiante.materia}</td>
      <td>${estudiante.promedio}</td>
   `;
      tbody.appendChild(fila);
   });

   // Agregamos la tabla al documento, agregamos el thead y el tbody a la tabla
   tabla.appendChild(thead);
   tabla.appendChild(tbody);
   document.body.appendChild(tabla);
}

// Asignar funciones a los botones guardar, cancelar y buscar
document.addEventListener("DOMContentLoaded", function () {

   // Asignar funciones a los botones
   document.querySelector("#guardarBtn").addEventListener("click", guardarDatos);
   document.querySelector("#cancelarBtn").addEventListener("click", limpiarFormulario);
   document.querySelector("#buscarBtn").addEventListener("click", buscarEstudiantePorDNI);
   document.querySelector("#gradoBtn").addEventListener("click", mostrarEstudiantesGrado);

   const dniInput = document.querySelector("#dni");
   dniInput.addEventListener("input", function () {
      limitarCaracteresDni(dniInput);
   });
});


function mostrarEstudiantesGrado() {

   // Obtener el valor del grado ingresado por el usuario
   const gradoSeleccionado = document.querySelector("#inputGrado").value.trim();

   if (gradoSeleccionado === "") {

      Swal.fire({
         icon: 'error',
         title: 'Error',
         text: 'Por favor ingresa un grado antes de buscar estudiantes.'
      });
      return; 
   }

   // Realizar la búsqueda y filtrado de estudiantes
   fetch("/json/alumnos.json")
      .then(response => response.json())
      .then(json => {

         // Filtrar estudiantes por el grado seleccionado
         const estudiantesFiltrados = json.filter(estudiante => estudiante.grado === gradoSeleccionado);

         // Mostrar los resultados filtrados
         mostrarResultados(estudiantesFiltrados);
      })
}

// Función para mostrar los resultados en una tabla
const mostrarResultados = (estudiantes) => {

   // Mostrar el mensaje de carga 
   const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
         toast.onmouseenter = Swal.stopTimer;
         toast.onmouseleave = Swal.resumeTimer;
      }
   });
   Toast.fire({
      icon: "info",
      title: "Cargando ....."
   });

   setTimeout(() => {

      // Limpiar resultados anteriores
      const tablaAnterior = document.querySelector("#tablaEstudiante");
      if (tablaAnterior) {
         tablaAnterior.remove();
      }

      // Crear la estructura de la tabla
      const tabla = document.createElement("table");
      tabla.id = "tablaEstudiante";
      const thead = document.createElement("thead");
      thead.innerHTML = `
         <tr>
            <th>Grado</th>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Materia</th>
         </tr>
      `;
      const tbody = document.createElement("tbody");

      // Iterar sobre cada estudiante filtrado y crear una fila para cada uno
      estudiantes.forEach((estudiante) => {
         const fila = document.createElement("tr");
         fila.innerHTML = `
            <td>${estudiante.grado}</td>
            <td>${estudiante.dni}</td>
            <td>${estudiante.nombre}</td>
            <td>${estudiante.apellido}</td>
            <td>${estudiante.materia}</td>
         `;
         tbody.appendChild(fila);
      });

      // Agregar la tabla al documento
      tabla.appendChild(thead);
      tabla.appendChild(tbody);
      document.querySelector("#resultado").innerHTML = "";
      document.body.appendChild(tabla);

      // Mostrar el mensaje de Carga Exitosa antes de cargar los resultados
      Swal.fire({
         position: "top-end",
         icon: "success",
         title: "Carga Exitosa !!!",
         showConfirmButton: false,
         timer: 1000
      });
   }, 1600);
};




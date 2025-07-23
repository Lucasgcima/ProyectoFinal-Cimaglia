// Lista de ciudades válidas
const ciudadesValidas = [
  "san carlos de bariloche",
  "buenos aires",
  "salta",
  "iguazú",
  "mendoza",
  "el calafate",
  "ushuaia",
  "cordoba"
];

// Constructor de reservas
function Reserva(ciudad, fecha, documento) {
  this.ciudad = ciudad.toLowerCase();
  this.fecha = fecha;
  this.documento = documento.replace(/\./g, "");
}

// Recuperar reservas guardadas en localStorage
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// Función para agregar una reserva nueva
function agregarReserva() {
  const ciudad = document.getElementById("nuevaCiudad").value.trim().toLowerCase();
  const fecha = document.getElementById("nuevaFecha").value.trim();
  const documento = document.getElementById("nuevoDocumento").value.trim().replace(/\./g, "");
  const mensaje = document.getElementById("mensaje-agregado");

  if (!ciudad || !fecha || !documento) {
    mensaje.textContent = "Por favor complete todos los campos.";
    mensaje.style.color = "red";
    return;
  }

  // Validar ciudad
  if (!ciudadesValidas.includes(ciudad)) {
    mensaje.textContent = "La ciudad ingresada no es válida o no tenemos hoteles allí.";
    mensaje.style.color = "red";
    return;
  }

  // Validar fecha dentro de rango permitido
  const hoy = new Date();
  hoy.setHours(0,0,0,0);

  const fechaReserva = new Date(fecha.split("/").reverse().join("/"));
  fechaReserva.setHours(0,0,0,0);

  const unAnioDespues = new Date(hoy);
  unAnioDespues.setFullYear(hoy.getFullYear() + 1);

  if (fechaReserva < hoy) {
    mensaje.textContent = "La fecha de reserva no puede ser anterior a hoy.";
    mensaje.style.color = "red";
    return;
  }

  if (fechaReserva > unAnioDespues) {
    mensaje.textContent = "La fecha de reserva no puede ser más de 1 año desde hoy.";
    mensaje.style.color = "red";
    return;
  }

  const confirmar = confirm("¿Está seguro que desea agregar esta reserva?");
  if (!confirmar) {
    mensaje.textContent = "Reserva cancelada por el usuario.";
    mensaje.style.color = "orange";
    return;
  }

  const nuevaReserva = new Reserva(ciudad, fecha, documento);
  reservas.push(nuevaReserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  mensaje.textContent = "Reserva agregada correctamente.";
  mensaje.style.color = "green";

  document.getElementById("nuevaCiudad").value = "";
  document.getElementById("nuevaFecha").value = "";
  document.getElementById("nuevoDocumento").value = "";
}

// Función para buscar una reserva existente
function buscarReserva() {
  const ciudadInput = document.getElementById("ciudad").value.trim().toLowerCase();
  const fechaInput = document.getElementById("fecha").value.trim();
  const documentoInput = document.getElementById("documento").value.trim().replace(/\./g, "");
  const resultado = document.getElementById("resultado");

  const confirmado = confirm("¿Revisó que los datos estén cargados correctamente?");
  if (!confirmado) {
    resultado.textContent = "Búsqueda cancelada por el usuario.";
    resultado.style.color = "orange";
    return;
  }

  if (!ciudadesValidas.includes(ciudadInput)) {
    resultado.textContent = "La ciudad ingresada no es válida o no tenemos hoteles allí.";
    resultado.style.color = "red";
    return;
  }

  const reservaEncontrada = reservas.find(r =>
    r.ciudad === ciudadInput &&
    r.fecha === fechaInput &&
    r.documento === documentoInput
  );

  if (reservaEncontrada) {
    resultado.innerHTML = `
      <strong>¡Felicitaciones!</strong> La reserva fue hecha correctamente.<br>
      <em>Lo esperamos en <u>${reservaEncontrada.ciudad}</u> el día ${reservaEncontrada.fecha}</em>.
    `;
    resultado.style.color = "green";
  } else {
    resultado.textContent = "Lamentablemente no tiene hecha una reserva en este hotel.";
    resultado.style.color = "red";
  }
}

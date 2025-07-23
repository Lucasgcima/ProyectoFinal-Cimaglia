// Constructor
function Reserva(ciudad, fecha, documento) {
  this.ciudad = ciudad.toLowerCase();
  this.fecha = fecha;
  this.documento = documento.replace(/\./g, "");
}

// Cargar reservas desde localStorage (si existen)
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// Agregar reserva
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

// Buscar reserva
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

  // Método de orden superior: find
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

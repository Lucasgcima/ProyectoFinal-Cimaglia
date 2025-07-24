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

  // Validar ciudad usando API GeoDB Cities
  const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${ciudad}&limit=1`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7715d8ed9fmsh05e7c03017ec0d4p13b0c4jsn3ef4d71ba371
',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      if (data.data.length === 0) {
        mensaje.textContent = "La ciudad ingresada no fue encontrada en la base de datos global.";
        mensaje.style.color = "red";
        return;
      }

      // Si pasa la validación, continuar con la reserva
      continuarCreandoReserva(ciudad, fecha, documento);
    })
    .catch(err => {
      mensaje.textContent = "Error al validar la ciudad con el servidor.";
      mensaje.style.color = "red";
      console.error(err);
    });
}

// Lógica completa para validar y guardar una reserva
function continuarCreandoReserva(ciudad, fecha, documento) {
  const mensaje = document.getElementById("mensaje-agregado");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaReserva = new Date(fecha.split("/").reverse().join("/"));
  fechaReserva.setHours(0, 0, 0, 0);

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

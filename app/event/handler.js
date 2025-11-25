import { darFormatoRUT } from "../utils/format.js";
import { FormHelper } from "../utils/formHelper.js";
// import { UI } from "../models/ui.js";
import { ViewManager } from "../ui/ViewManager.js";
import { Database } from "../db/database.js";
import { ParkingMatrix } from "../models/parkingMatriz.js";
import { renderMatrix } from "../ui/renderMatrix.js";

export async function initUIEvents() {

  const sidebarMenu = document.getElementById('sidebarMenu');
  const offcanvas = new bootstrap.Offcanvas(sidebarMenu);
  
  // Mostrar el sidebar al iniciar
  // offcanvas.show();

  // Selectores
  const btns_modal = document.querySelectorAll('.btn_modal');
  const modal = document.getElementById('modal');
  const btnModalMatrix = document.getElementById('btn-show-matrix');
  const btnConfig = document.getElementById('btn_config');
  const btnHelp = document.getElementById('btn_help');
  
  const tipoVehiculo = document.getElementById("tipo_vehiculo");
  const divPatente = document.getElementById("div_patente");
  const patente = document.getElementById('matricula');
  
  // EVENTS CHANGE
  tipoVehiculo.onchange = ({ target: { value } }) => {
    const config = {
      moto:  { placeholder: "EJ: ABC12", minlength: 5, maxlength: 5 },
      auto:  { placeholder: "Ej: DC8L78", minlength: 6, maxlength: 6 }
    };

    const { placeholder, minlength, maxlength } = config[value] || config.auto;
    Object.assign(patente, { placeholder, minlength, maxlength });
  };

  // EVENTS CLICK
  btns_modal.forEach(btn => btn.onclick = () =>  {
    modal.showModal()
    updateView();
  });

  btnModalMatrix.addEventListener('click', (e) => {
    if (e.target.textContent === 'Ver espacios') {
      renderMatrix(parking.matrix, document.getElementById('min-parking'), undefined, 'cell-sm');
      updateView();
      e.target.textContent = 'Ocultar';
    } else {
      document.getElementById('min-parking').innerHTML = ''
      e.target.textContent = 'Ver espacios';
    }
  })

  btnConfig.addEventListener("click", async() => {
    const { value: formValues } = await Swal.fire({
      title: "Configurar Estacionamiento",
      html: `
        <label for="swal-rows" style="display:block; text-align:left; margin-bottom:4px;">
          Cantidad de filas
        </label>
        <input id="swal-rows" type="number" min="1" class="swal2-input" placeholder="Ej: 5">

        <label for="swal-cols" style="display:block; text-align:left; margin-top:12px; margin-bottom:4px;">
          Cantidad de columnas
        </label>
        <input id="swal-cols" type="number" min="1" class="swal2-input" placeholder="Ej: 10">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const rows = document.getElementById("swal-rows").value;
        const cols = document.getElementById("swal-cols").value;

        if (!rows || !cols || rows <= 0 || cols <= 0) {
          Swal.showValidationMessage("Debes ingresar valores válidos para filas y columnas");
          return false;
        }

        return [parseInt(rows), parseInt(cols)];
      }
    });

      if (formValues) {
        Swal.fire(`Filas: ${formValues[0]} · Columnas: ${formValues[1]}`);

        parking = new ParkingMatrix(formValues[0], formValues[1]);
        updateView();
      }

  })

  // CLICK HELP
  btnHelp.addEventListener("click", () => {
    Swal.fire({
  title: 'Créditos del Proyecto',
  html: `
    <div style="text-align: left; font-family: 'Inter', sans-serif;">

      <!-- Tarjeta principal -->
      <div style="
        background: #ffffff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      ">

        <h3 style="margin-bottom: 10px; font-weight: 600; color: #111;">Equipo de Desarrollo</h3>

        <!-- Líder -->
        <div style="
          display: flex; 
          align-items: center; 
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 10px;
          background: #f0f4f8ff;
        ">
          <div style="
            width: 42px; height: 42px; 
            background: #007bff;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border-radius: 10px;
            color: #fff;
            font-weight: 700;
          ">MA</div>

          <div style="margin-left: 10px;">
            <div style="font-size: 0.95em; font-weight: 600;">Marco Antonio</div>
            <div style="font-size: 0.83em; opacity: 0.75;">Líder de Desarrollo</div>
          </div>
        </div>

        <!-- Resto del equipo -->
        <div style="margin-top: 10px;">
          ${[
            { inicial: "AC", nombre: "Alejandra Campusano", rol: "Frontend Developer", color: "rgba(230, 9, 82, 0.8)" },
            { inicial: "RP", nombre: "Richard Perez", rol: "Backend Developer", color: "rgba(0, 87, 138, 1)"},
            { inicial: "FR", nombre: "Franco Riveros", rol: "Documentador" },
          ].map(m => `
            <div style="
              display: flex; 
              align-items: center; 
              padding: 8px;
              border-radius: 10px;
              margin-bottom: 8px;
              background: #fdfdfd;
              border: 1px solid #eee;
            ">
              <div style="
                width: 38px; height: 38px; 
                background: ${m.color || '#888'};
                display: flex; 
                align-items: center; 
                justify-content: center; 
                border-radius: 10px;
                color: #fff;
                font-weight: 600;
              ">${m.inicial}</div>

              <div style="margin-left: 10px;">
                <div style="font-size: 0.9em; font-weight: 600;">${m.nombre}</div>
                <div style="font-size: 0.78em; opacity: 0.75;">${m.rol}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Tecnologías -->
        <h3 style="margin-top: 20px; font-weight: 600; color: #111;">Tecnologías utilizadas</h3>
        <div style="
          display: flex;
          gap: 15px;
          margin-top: 10px;
          justify-content: start;
          align-items: center;
        ">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" width="40">
        </div>

        <!-- Footer -->
        <div style="margin-top: 20px; font-size: 0.85em; text-align: center; opacity: 0.7;">
          Prototipo desarrollado para la gestión de estacionamientos<br>
          © 2025 — v1.0.0
        </div>

      </div>
    </div>
  `,
  width: 600,
  confirmButtonText: 'Cerrar',
  confirmButtonColor: '#0d6efd'
});

  })

  // EVENTS INPUTS
  document.getElementById('rut').addEventListener('input', (e) => {
    // formatear rut
    let rutFormateado = darFormatoRUT(e.target.value);
    e.target.value = rutFormateado;
  });

  // Submit
  const formHelper = new FormHelper("visita-form");

  formHelper.onSubmit((data) => {
    console.log("Datos del formulario:");
    console.table(data);
    console.log(data)
    // Aquí puedes seguir con la lógica de validación, DB, etc.
    modal.close();

    new Database().create()
    const vm = new ViewManager();
    vm.agregarVisita(formHelper.getData());
    formHelper.reset();
    
  });

  // Load
  let parking = new ParkingMatrix(3, 7);
  const container = document.getElementById("parking");

  function updateView() {
    renderMatrix(parking.matrix, container, (row, col) => {
      parking.toggleStatus(row, col);
      updateView();
    });
  }
  updateView();

}
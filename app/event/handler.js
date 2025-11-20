import { darFormatoRUT } from "../utils/format.js";
import { FormHelper } from "../utils/formHelper.js";
import { UI } from "../models/ui.js";
import { Database } from "../db/database.js";
import { ParkingMatrix } from "../models/parkingMatriz.js";
import { renderMatrix } from "../ui/renderMatrix.js";

export async function initUIEvents() {


  // Mostrar el sidebar al iniciar
  const sidebarMenu = document.getElementById('sidebarMenu');
  const offcanvas = new bootstrap.Offcanvas(sidebarMenu);

  offcanvas.show();

  // Modal
  const btnModal = document.getElementById('btn_modal');
  const modal = document.getElementById('modal');
  const btnModalMatrix = document.getElementById('btn-show-matrix');
  
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
  btnModal.onclick = () => modal.showModal();
  btnModalMatrix.addEventListener('click', () => {
    
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
    const ui = new UI();
    ui.agregarVisita(formHelper.getData());
    formHelper.reset();
    
  });

  // Load
  const parking = new ParkingMatrix(3, 7);
  const container = document.getElementById("parking");

  function updateView() {
    renderMatrix(parking.matrix, container, (row, col) => {
      parking.toggleStatus(row, col);
      updateView();
    });
  }
  updateView();

}
export function renderMatrix(matrix, container, onClick, extra_class) {
  container.innerHTML = ""; // Limpiar contenedor

  matrix.forEach((row, i) => {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    row.forEach((cell, j) => {
      const cellEl = document.createElement("div");
      cellEl.className = `cell ${cell.status} ${extra_class}`;
      cellEl.addEventListener("click", () => onClick(i, j));

      // Mostrar número y posición dentro de la celda
      cellEl.innerHTML = `
        <span class="cell-number fw-bold">${cell.number}</span>
        <small class="cell-pos">(${cell.position.row},${cell.position.col})</small>
      `;

      rowEl.appendChild(cellEl);
    });

    container.appendChild(rowEl);
  });
}
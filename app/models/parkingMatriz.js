export class ParkingMatrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = this.createMatrix();
  }

  createMatrix() {
    let number = 1;
    return Array.from({ length: this.rows }, (_, row) =>
      Array.from({ length: this.cols }, (_, col) => ({
        status: "free",
        number: number++,
        position: { row, col }
      }))
    );
  }

  toggleStatus(row, col) {
    const cell = this.matrix[row][col];
    const order = ["free", "occupied", "reserved"];
    cell.status = order[(order.indexOf(cell.status) + 1) % order.length];
  }

  getStatus(row, col) {
    return this.matrix[row][col].status;
  }

  getNumber(row, col) {
    return this.matrix[row][col].number;
  }

  setStatus(row, col) {
    this.matrix[row][col].status = "ocuppied";
  }
}

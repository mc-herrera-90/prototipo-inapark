export class FormHelper {
  constructor(formId) {
    this.form = document.getElementById(formId);
  }
  getData() {
    const data = {};
    [...this.form.elements].forEach(el => {
      if (el.name) data[el.name] = el.value;
    });
    return data;
  }

  onSubmit(callback) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = this.getData();
      callback(data, e);
    });
  }

  reset() {
    this.form.reset();
  }
}

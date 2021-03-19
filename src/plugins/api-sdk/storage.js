/* eslint no-prototype-builtins: "off" */

class Storage {
  constructor(name) {
    this.name = name;
    this.data = this.loadData();
  }

  loadData() {
    const data = sessionStorage.getItem(this.name);
    if (data) {
      return JSON.parse(data);
    }

    return {};
  }

  saveData() {
    sessionStorage.setItem(this.name, JSON.stringify(this.data));
  }

  set(key, value) {
    this.data[key] = value;
    this.saveData();
  }

  get(key) {
    return this.data.hasOwnProperty(key) ? this.data[key] : null;
  }

  remove(key) {
    delete this.data[key];
    this.saveData();
  }

  removeAll() {
    sessionStorage.removeItem(this.name);
    this.data = {};
  }
}

export default Storage;

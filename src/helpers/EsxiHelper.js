/* eslint-disable import/prefer-default-export */

class EsxiHelper {
  constructor(value) {
    this.value = value;
  }

  bytesToSize() {
    if (!this.value || this.value < 0) {
      return 0;
    }
    const i = Math.floor(Math.log(this.value) / Math.log(1024));

    return Math.round((this.value / 1024 ** i) * 100) / 100;
  }

  bytesToSizeLabel() {
    if (!this.value || this.value < 0) {
      return 0;
    }

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.round(Math.log(this.value) / Math.log(1024));
    return `${Math.round((this.value / 1024 ** i) * 100) / 100}  ${sizes[i]}`;
  }

  hertzToGigahertz() {
    if (!this.value) {
      return 0;
    }

    return Math.round((this.value / 1000000 / 1000) * 100) / 100;
  }
}

export const esxi = (value) => new EsxiHelper(value);

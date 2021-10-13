/* eslint-disable import/prefer-default-export */

class EsxiHelper {
  constructor(esxi) {
    this.esxi = esxi;
  }

  bytesToSize() {
    if (!this.esxi || this.esxi < 0) {
      return;
    }
    const i = Math.floor(Math.log(this.esxi) / Math.log(1024));

    return Math.round(this.esxi / 1024 ** i);
  }

  bytesToSizeLabel() {
    if (!this.esxi || this.esxi < 0) {
      return;
    }

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(this.esxi) / Math.log(1024));

    return `${Math.round(this.esxi / 1024 ** i)}  ${sizes[i]}`;
  }
}

export const esxi = (esxi) => new EsxiHelper(esxi);

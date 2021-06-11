export default {
  bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (!bytes) {
      return '0 Byte';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${Math.round(bytes / 1024 ** i)}  ${sizes[i]}`;
  },

  hertzToGigahertz(hertz) {
    if (!hertz) {
      return '0 Hertz';
    }

    return `${Math.round((hertz / 1000000 / 1000) * 100) / 100} GHz`;
  },

}

/* eslint-disable import/prefer-default-export */

import { DateTime } from 'luxon';

class DateHelper {
  constructor(date) {
    this.date = date;
    this.format = 'dd LLL yyyy HH:mm';
  }

  toHuman() {
    return this.getDate().toFormat(this.format);
  }

  toISO() {
    return this.getDate().toISO();
  }

  toSeconds() {
    return this.getDate().toSeconds();
  }

  getDate() {
    if (typeof this.date === 'number') {
      return DateTime.fromSeconds(this.date);
    }

    return DateTime.fromISO(this.date);
  }
}

export const date = date => new DateHelper(date);

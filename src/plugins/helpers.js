import { DateTime } from 'luxon';
import config from '../config';

export const getParam = (name) => {
  const url = new URL(window.location.toString());
  return url.searchParams.get(name);
};

export const deleteParam = (name) => {
  const url = new URL(window.location.toString());
  url.searchParams.delete(name);
  window.history.replaceState(window.history.state, '', url.toString());
};

export const getReturnUri = () => {
  const returnUri = getParam('return_uri');
  if (returnUri) {
    return returnUri;
  }

  if (window.location.pathname !== '/login') {
    return window.location.pathname + window.location.search;
  }
  return '/';
};

export const getSsoUrl = () => {
  let redirectUrl = `${window.location.origin}/login`;
  const returnUri = getReturnUri();
  if (returnUri) {
    redirectUrl += `?sso_login=true&return_uri=${returnUri}`;
  }
  return `${config.um.url}/../login?redirect_url=${encodeURIComponent(redirectUrl)}`;
};

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

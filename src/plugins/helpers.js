import config from '../config';

export const getParam = (name) => {
  const url = new URL(window.location.toString());
  return url.searchParams.get(name);
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
    redirectUrl += `?return_uri=${returnUri}`;
  }
  return `${config['user-management'].url}/login?redirect_url=${redirectUrl}`;
};

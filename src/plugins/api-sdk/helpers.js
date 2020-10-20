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

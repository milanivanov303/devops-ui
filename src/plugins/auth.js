import store from '@/store';

export default function can (action) {
  const user = store.getters.user;

  if (typeof user.permissions === 'undefined') {
    return false;
  }

  if (user.permissions === '*') {
    return true;
  }

  if (user.permissions.indexOf(action) !== -1) {
    return true;
  }

  return false;
};

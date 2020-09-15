
import Auth from './auth';
import Api from './api';

class ApiSdk {
  constructor(url, code, options) {
    this.auth = new Auth(url, code, options);

    if (this.auth.getUser()) {
      this.auth.getIdentity();
    }
  }

  api(url, code) {
    return new Api(this.auth, url, code);
  }
}

export default ApiSdk;

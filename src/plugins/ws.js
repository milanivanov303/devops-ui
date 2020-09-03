import Stomp from 'stompjs';

class WebSocket {
  constructor(url, username, password, vhost, debug = true) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.vhost = vhost;
    this.debug = debug;

    this.interval = null;
    this.queues = {};

    this.connect();
  }

  connect() {
    this.client = Stomp.client(this.url);

    if (!this.debug) {
      this.client.debug = () => {};
    }

    this.client.connect(
      this.username,
      this.password,
      () => this.onConnect(),
      () => this.onError(),
      this.vhost,
    );
  }

  onConnect() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    // resubscribe to active queues
    Object.values(this.queues).forEach(
      queue => this.subscribe(queue.name, queue.callback, queue.headers),
    );
  }

  onError() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => this.connect(), 2000);
  }

  isConnected() {
    return this.client.connected;
  }

  subscribe(name, callback, headers) {
    const subscribe = this.client.subscribe(name, callback, headers);

    // save queue id so on resubscribe it stays the same
    headers.id = subscribe.id;

    // save queue
    this.queues[subscribe.id] = { name, callback, headers };

    // replace unsubscribe function
    subscribe.unsubscribe = () => this.unsubscribe(subscribe.id);

    return subscribe;
  }

  unsubscribe(id) {
    delete this.queues[id];
    this.client.unsubscribe(id);
  }
}
export default WebSocket;

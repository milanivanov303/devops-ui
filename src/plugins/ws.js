import Stomp from 'stompjs';
import config from '../../config';

const client = Stomp.client(config.ws.url);

client.reconnect_delay = 5000; // The delay is in milli seconds

client.connect(
  config.ws.username,
  config.ws.password,
  () => { console.log('connected'); },
  (error) => { console.log('error', error); },
  config.ws.vhost,
);

// client.debug = () => {};

export default client;

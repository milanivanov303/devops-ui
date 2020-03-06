import Stomp from 'stompjs';
import config from '../../config';

const ws = new WebSocket(config.ws.url);
const client = Stomp.over(ws);

client.connect(
  config.ws.username,
  config.ws.password,
  () => { console.log('connected'); },
  (error) => { console.log('error', error); },
  config.ws.vhost,
);

// client.debug = () => {};

export default client;

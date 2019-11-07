import config from '../../config';
import Stomp from 'stompjs';

const ws = new WebSocket(config.ws.url);
const client = Stomp.over(ws);

client.connect(
  config.ws.username,
  config.ws.password,
  () => {},
  () => {},
  config.ws.vhost,
);

client.debug = function(str) {};

export default client;

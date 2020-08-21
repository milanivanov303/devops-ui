import Stomp from 'stompjs';
import config from '../../config';

let stompClient = Stomp.client(config.ws.url);

let stompFailureCallback = function (error) {
  console.log('STOMP: ' +  error);
  setTimeout(stompConnect, 10000);
  console.log('STOMP: Reconecting in 10 seconds');
};

let stompSuccessCallback = function (frame) {
  console.log('STOMP: Connection successful');
};

function stompConnect() {
  console.log('STOMP: Attempting connection');
  // recreate the stompClient to use a new WebSocket
  stompClient.connect(config.ws.username, config.ws.password, stompSuccessCallback, stompFailureCallback, config.ws.vhost);
}

stompConnect();

// client.debug = () => {};

export default stompClient;

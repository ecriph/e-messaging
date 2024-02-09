import { io } from 'socket.io-client';
import { EnvironmentVariables } from '../../runtime/environment-vairables';

const socket = io(EnvironmentVariables.MAIN_API_URL + '/events', {
  reconnection: true, // Enable reconnection
  reconnectionDelay: 100, // Initial delay before attempting to reconnect (in milliseconds)
  reconnectionDelayMax: 500, // Maximum delay between reconnection attempts (in milliseconds)
  randomizationFactor: 0.5,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;

import { io } from 'socket.io-client';
import { EnvironmentVariables } from '../runtime/environment-vairables';

const socket = io(EnvironmentVariables.MAIN_API_URL);

export default socket;

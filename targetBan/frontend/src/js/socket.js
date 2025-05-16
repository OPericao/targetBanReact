import { io } from 'socket.io-client';

const socket = io('https://targetbanreact-production.up.railway.app');

export default socket;

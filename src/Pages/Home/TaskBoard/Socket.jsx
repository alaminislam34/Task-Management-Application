import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_URL, {
  transports: ["websocket"],
});

export default socket;

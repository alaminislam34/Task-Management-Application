import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_URL}`, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.connected);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection Error:", err);
});

export default socket;

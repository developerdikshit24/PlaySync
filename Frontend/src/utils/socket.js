// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
    withCredentials: true
});

export const joinSocket = (userId) => {
    socket.emit("join", userId);
};

export default socket;
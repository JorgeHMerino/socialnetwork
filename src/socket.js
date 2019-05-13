import * as io from "socket.io-client";
import { onlineUsers, userJoined, userLeft } from "./actions";
let socket;

export function getSocket(store) {
    if (!socket) {
        socket = io.connect();
        socket.on("onlineUsers", data => {
            console.log("show onlineUsers in socket: ", data);
            store.dispatch(onlineUsers(data));
        });
        socket.on("userJoined", data => {
            console.log("show userJoined in socket: ", data);
            store.dispatch(userJoined(data));
        });
        socket.on("userLeft", data => {
            console.log("show userLeft in socket: ", data);
            store.dispatch(userLeft(data));
        });
    }
    return socket;
}

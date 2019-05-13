import axios from "./axios";

export async function receiveFriendsWannabes() {
    console.log("receiveFriendsWannabes: ", data);
    const { data } = await axios.get("/friends-wannabes");
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        allFriends: data
    };
}

export async function deleteFriend(id) {
    console.log("deleteFriend: ", id);
    await axios.post("/cancel-request/", { Id: id });
    return {
        type: "DELETE_FRIENDS",
        friend: id
    };
}

export async function acceptFriend(id) {
    console.log("acceptFriend: ", id);
    await axios.post("/accept-request/", { Id: id });
    return {
        type: "ACCEPT_FRIENDS",
        friend: id
    };
}

export function onlineUsers(data) {
    console.log("onlineUsers: ", data);
    return {
        type: "ONLINE_USERS",
        onlineUsers: data.onlineUsers
    };
}

export function userJoined(data) {
    console.log("userJoined: ", data);
    return {
        type: "USER_JOINED",
        userJoined: data.user
    };
}

export function userLeft(data) {
    console.log("userLeft: ", data);
    return {
        type: "USER_LEFT",
        id: data
    };
}

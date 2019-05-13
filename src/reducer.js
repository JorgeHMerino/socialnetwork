export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = Object.assign({}, state, {
            allFriends: action.allFriends
        });
    }

    if (action.type == "ACCEPT_FRIENDS") {
        state = Object.assign({}, state, {
            allFriends: state.allFriends.map(friend => {
                if (action.friend == friend.id) {
                    return Object.assign({}, friend, {
                        accepted: true
                    });
                } else {
                    return Object.assign({}, friend);
                }
            })
        });
    }

    if (action.type == "DELETE_FRIENDS") {
        state = Object.assign({}, state, {
            allFriends: state.allFriends.filter(friend => {
                if (action.friend !== friend.id) {
                    return friend;
                }
            })
        });
    }

    if (action.type == "ONLINE_USERS") {
        return Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        });
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.userJoined]
        };
        return state;
    }

    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(onlineUsers => {
                if (action.id != onlineUsers.id) {
                    return state;
                }
            })
        };
    }
    return state;
}

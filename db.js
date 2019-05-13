var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:jorgehuertamerino:password@localhost:5432/social"
);

module.exports.addUsers = function addUsers(
    firstname,
    lastname,
    email,
    password
) {
    return db.query(
        "INSERT INTO usersTable (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) returning *",
        [firstname, lastname, email, password]
    );
};

module.exports.logIn = function logIn(email) {
    return db.query(
        "SELECT id, email, password FROM usersTable WHERE email=$1",
        [email]
    );
};

module.exports.getUserById = function getUserById(id) {
    return db.query(
        "SELECT id, imageUrl, firstname, lastname, bio FROM usersTable WHERE id=$1",
        [id]
    );
};

module.exports.uploadImage = function uploadImage(imageUrl, id) {
    return db.query(
        "UPDATE usersTable SET imageUrl= $1 WHERE id= $2 returning imageUrl",
        [imageUrl, id]
    );
};

module.exports.insertBio = function insertBio(bioSentence, userId) {
    return db.query("UPDATE usersTable SET bio= $1 WHERE id=$2 returning bio", [
        bioSentence,
        userId
    ]);
};

module.exports.getBioById = function getBioById(userId) {
    return db.query("SELECT bio FROM usersTable WHERE id=$1", [userId]);
};

module.exports.getInitialStatus = function getInitialStatus(myId, otherUserId) {
    return db.query(
        "SELECT * FROM friendships WHERE (receiver=$1 AND sender=$2) OR (receiver=$2 AND sender=$1)",
        [myId, otherUserId]
    );
};

module.exports.sendFriendRequest = function sendFriendRequest(
    myId,
    otherUserId
) {
    return db.query(
        "INSERT INTO friendships (receiver, sender) VALUES ($1, $2) returning *",
        [myId, otherUserId]
    );
};

module.exports.endRequest = function endRequest(myId, otherUserId) {
    return db.query(
        "DELETE FROM friendships WHERE (receiver=$2 AND sender=$1) OR (receiver=$1 AND sender=$2)",
        [myId, otherUserId]
    );
};

module.exports.acceptRequest = function acceptRequest(myId, otherUserId) {
    return db.query(
        "UPDATE friendships SET accepted = true WHERE (receiver=$2 AND sender=$1) OR (receiver=$1 AND sender=$2)",
        [myId, otherUserId]
    );
};

module.exports.getAll = function getAll(id) {
    return db.query(
        `SELECT usersTable.id, firstname, lastname, accepted, receiver, sender, imageUrl
        FROM friendships
        JOIN usersTable
        ON (accepted = false AND receiver = $1 AND sender = usersTable.id)
        OR (accepted = true AND receiver = $1 AND sender = usersTable.id)
        OR (accepted = true AND sender = $1 AND receiver = usersTable.id)`,
        [id]
    );
};

module.exports.getUsersByIds = function getUsersByIds(arrayOfIds) {
    return db.query(
        `SELECT id, firstname, lastname, imageUrl FROM usersTable WHERE id = ANY($1)`,
        [arrayOfIds]
    );
};

// APP
const express = require("express");
const app = express();
// COMPRESSION
const compression = require("compression");
// COOKIES
const cookieSession = require("cookie-session");
// PARSER
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// DB
const db = require("./db");
// BCRYPT
const bcrypt = require("./bcrypt");
// CSURF
const csurf = require("csurf");
// AWS_SECRET
const s3 = require("./s3");
// MULTER, UIDSAFE AND PATH
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
// SOCKET
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
// UPLOADING
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 5000000
    }
});
//////////////////////////////////////////////////////////
// SET APPS
// COMPRESSION
app.use(compression());
// COOKIES
const cookieSessionMiddleware = cookieSession({
    secret: `I'm always happy.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// PARSER
app.use(cookieParser());
// CSURF
app.use(csurf());
//////////////////////////////////////////////////////////
// CSRF
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
// JSON
app.use(bodyParser.json({}));
// STATICS
app.use(express.static("./wintergreen-socialnetwork"));
app.use(express.static("public"));
//////////////////////////////////////////////////////////
// BUNDLE
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//////////////////////////////////////////////////////////
// PART 3
function requireLoggedInUser(req, res, next) {
    if (!req.session.userId) {
        res.sendStatus(403);
    } else {
        next();
    }
}

app.get("/user", requireLoggedInUser, (req, res) => {
    db.getUserById(req.session.userId).then(({ rows }) => {
        console.log("rows", rows);
        res.json(rows[0]);
    });
});

app.post(
    "/upload-profilepic",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        console.log("req.file", req.file);
        let file = req.file;
        if (file) {
            let imgUrl = `https://s3.amazonaws.com/spicedling/${file.filename}`;
            db.uploadImage(imgUrl, req.session.userId).then(results => {
                console.log("results", results);
                res.json(results.rows[0]);
            });
        } else {
            res.json({
                success: false
            });
        }
    }
);
//////////////////////////////////////////////////////////
// PART 1 (ROUTES)
app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/registration", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    console.log(req.body);
    if (firstname == "" || lastname == "" || email == "" || password == "") {
        console.log("true");
        res.json({ success: false });
    } else {
        console.log("password", password);
        bcrypt.hashPassword(password).then(hashedPass => {
            db.addUsers(firstname, lastname, email, hashedPass)
                .then(data => {
                    console.log("my data in addUsers", data);
                    req.session.userId = data.rows[0].id;
                    res.json({ success: true });
                })
                .catch(error => {
                    console.log("error in registration", error);
                    res.json({ error: true });
                });
        });
    }
});
// PART 2 (ROUTES)
app.post("/login", (req, res) => {
    // console.log("req.body", req.body);
    let xEmail = req.body.email;
    let xPassword = req.body.password;
    db.logIn(xEmail)
        .then(data => {
            console.log("log in data", data);
            let yPassword = data.rows[0].password;
            let userId = data.rows[0].id;
            bcrypt
                .checkPassword(xPassword, yPassword)
                .then(equal => {
                    if (equal) {
                        req.session.userId = userId;
                        res.json({ success: true });
                    } else {
                        res.json({ error: true });
                    }
                })
                .catch(error => {
                    console.log("error while password", error);
                    res.json({ error: true });
                });
        })
        .catch(error => {
            console.log("error while log in", error);
            res.json({ error: true });
        });
});
// PART 4 (ROUTES)
app.get("/getbio", (req, res) => {
    db.getBioById(req.session.userId).then(results => {
        res.json(results.rows[0]);
    });
});

app.post("/setbio", (req, res) => {
    db.insertBio(req.body.bioSentence, req.session.userId).then(results => {
        console.log("results in setBio: ", results.rows[0]);
        res.json(results.rows[0]);
    });
});
// PART 5 (ROUTE)
app.get("/api-user/:id", async (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({ match: true });
    } else {
        const datos = await db.getUserById(req.params.id);
        res.json(datos.rows[0]);
    }
});
// PART 6 (ROUTES)
app.get("/get-initial-status/:id", async (req, res) => {
    const myId = req.session.userId;
    const otherUserId = req.params.id;
    console.log("initial status inserted");
    const initialStatus = await db.getInitialStatus(myId, otherUserId);
    console.log("current initial status: ", initialStatus);
    res.json(initialStatus.rows[0]);
});

app.post("/friendship-status", async (req, res) => {
    const myId = req.session.userId;
    const otherUserId = req.body.otherId;
    if (req.body.action == "add") {
        const sendRequest = await db.sendFriendRequest(myId, otherUserId);
        res.json(sendRequest.rows[0]);
    } else if (req.body.action == "cancel") {
        const endRequest = await db.endRequest(myId, otherUserId);
        console.log(endRequest);
        res.json({ success: true });
    } else if (req.body.action == "accept") {
        const acceptRequest = await db.acceptRequest(myId, otherUserId);
        console.log(acceptRequest);
        res.json({ success: true });
    }
});
// PART 7 (ROUTE)
app.get("/friends-wannabes", (req, res) => {
    db.getAll(req.session.userId, req.body.Id)
        .then(data => {
            console.log("get friends & wannabes: ", data.rows);
            res.json(data.rows);
        })
        .catch(error => {
            console.log("error: ", error);
        });
});
//
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//
//////////////////////////////////////////////////////////
server.listen(8080, function() {
    console.log("Social listening!");
});
//////////////////////////////////////////////////////////
// PART 8 (SOCKET)
const onlineUsers = {};

io.on("connect", socket => {
    console.log("socket.id in connect: ", socket.id);
    const { userId } = socket.request.session;
    if (!userId) {
        return socket.disconnect();
    }
    onlineUsers[socket.id] = userId;

    const onlineUsersIds = Object.values(onlineUsers);

    db.getUsersByIds(onlineUsersIds).then(({ rows }) => {
        socket.emit("onlineUsers", {
            onlineUsers: rows
        });
    });

    const currentlyOnline =
        Object.values(onlineUsers).filter(id => id == userId).length > 1;
    if (!currentlyOnline) {
        db.getUserById(userId).then(({ rows }) => {
            socket.broadcast.emit("userJoined", {
                user: rows[0]
            });
        });
    }

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        console.log("socket.id in disconnect: ", socket.id);
        const offline = !Object.values(onlineUsers).includes(userId);
        if (offline) {
            socket.broadcast.emit("userLeft", userId);
        }
    });
});

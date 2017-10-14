const express = require("express");
const requestUtil = require('request').defaults({encoding: null});
const messageUtils = require("./messages-util");
const md5 = require("md5");
var bodyParser = require('body-parser');

function setDefaultHeaders(request) {
    request.header('Access-Control-Allow-Origin', '*');
    request.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    request.header('Access-Control-Allow-Headers', 'Content-Type');
    request.header('Content-Type', 'application/json');
}

// client side
var app = express();
app.use(express.static("./client"));
app.listen(8090);
console.log("client side port 8080");


// client side test
app = express();
app.use(express.static("."));
app.listen(8081);
console.log("client side test port 8081");


// server side

app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

let waitingClients = [];
let users = [];
let anonymousIds = 0;

app.post("/register", function (request, response) {
    setDefaultHeaders(request);
    if (request.body.name === null) {
        response.status(400).send("missing [message].[name]");
        return;
    }
    if (request.body.email === null) {
        response.status(400).send("missing [message].[email]");
        return;
    }
    let newUser = {
        "name": request.body.name,
        "email": request.body.email,
    };
    if (request.body.email === "") {
        newUser.name = "Anonymous_" + anonymousIds++;
        newUser.email = newUser.name + "@babble.com";
    }

    let found = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === newUser.email) {
            found = true;
        }
    }
    if (!found) {
        users.push(newUser);
    }

    response.status(200).send(JSON.stringify(newUser));
});
app.post("/messages", function (request, response) {
    setDefaultHeaders(request);
    if (request.body.name === null || request.body.name.length === 0) {
        response.status(400).send("missing [message].[name]");
        return;
    }
    if (request.body.email === null || request.body.email.length === 0) {
        response.status(400).send("missing [message].[email]");
        return;
    }
    if (request.body.message === null || request.body.message.length === 0) {
        response.status(400).send("missing [message].[message]");
        return;
    }
    if (request.body.timestamp === null || request.body.timestamp.length === 0) {
        response.status(400).send("missing [message].[timestamp]");
        return;
    }

    let newMsg = messageUtils.addMessage(request.body);
    response.status(200).send(newMsg);

    for (let i = 0; i < waitingClients.length; i++) {
        waitingClients[i].status(200).send(JSON.stringify([newMsg]));
    }
    waitingClients = [];
});
app.get("/messages", function (request, response) {
    setDefaultHeaders(request);

    if (request.query.counter === null || isNaN(Number(request.query.counter))) {
        response.status(400).send("missing integer counter parameter");
        return;
    }

    let messages = messageUtils.getMessages(request.query.counter);
    if (messages.length === 0) {
        waitingClients.push(response);
        return;
    }

    response.status(200).send(JSON.stringify(messages));
});
app.get("/stats", function (request, response) {
    setDefaultHeaders(request);
    response.status(200).send(JSON.stringify({
        messages: messageUtils.messages.length,
        users: users.length
    }));
});
app.delete("/messages/:id", function (request, response) {
    setDefaultHeaders(request);
    if (request.params.id === null || isNaN(Number(request.params.id))) {
        response.status(400).send("missing integer message id parameter");
        return;
    }
    response.status(200).send(JSON.stringify(messageUtils.deleteMessage(request.params.id)));
});
app.get("/gravatar/:email", function (request, response) {
    setDefaultHeaders(request);

    let imgUrl = "https://www.gravatar.com/avatar/" + md5(request.params.email) + "?s=60&d=identicon";
    requestUtil.get(imgUrl, function (error, res, body) {
        response.set('Content-Type', 'application/png');
        response.status(200).send(new Buffer(body));
    });
});


app.listen(9000);
console.log("server side port 9000");


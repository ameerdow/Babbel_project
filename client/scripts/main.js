var Babble = {
    storage: new BabbleStorage()
};


function postMessage() {
    var msg = document.getElementById("textArea").value;
    console.log("Client side, sending message");
    var xhr = new XMLHttpRequest();
    var user = new userInfo("user", "email");
    var usr = user.getUser();
    var msg1 = new Message(usr.name, usr.name, msg, Date.now());

    console.log(user.getUser());
    console.log(msg1.getMessage());

    xhr.open("POST", "messages", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        message: msg,
        author: "ameer"
    }));
}


Babble.register = function (userInfo) {
};

Babble.getMessages = function (counter, callback) {
};

Babble.postMessage = function (message, callback) {
};

Babble.deleteMessage = function (id, callback) {
};

Babble.getStats = function (callback) {
};
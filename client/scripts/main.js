window.Babble = {
    storage: new BabbleStorage()
};

function request(options) {
    /* jshint -W098 */
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(options.method, "http://localhost:9000/" + options.action);
        if (options.method === 'post') {
            options.data = JSON.stringify(options.data);
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.addEventListener('load', event => {
            if (event.target.status === 200) {
                resolve(event.target.responseText);
            } else {
                reject(event);
            }
        });
        if (options.method === 'post') {
            xhr.send(options.data);
        } else {
            xhr.send();
        }
    });
}


function calculateTextareaHeight(event, element, maxHeight) {
    element.style.cssText = 'height:auto; padding:0';
    let height = element.scrollHeight > maxHeight ? maxHeight : element.scrollHeight;
    element.style.cssText = 'height:' + (height < 70 ? 70 : height) + 'px';

    if (event.keyCode === 13) {
        submitNewMessage(event, element.parentElement);
    }
}

function createMsgElement(msg) {

    let row = document.createElement("li");
    row.setAttribute("class", "chat-message");
    row.setAttribute("msgId", msg.id);
    row.innerHTML = `<img width="40" height="40" alt="${msg.name === "" ? "Anonymous" : msg.name}" src="${"http://localhost:9000/gravatar/" + (msg.email === "" ? "1" : msg.email)}">`;
    row.innerHTML += `<div class="content" tabindex="0">
<div class="msg-details">
<cite>${msg.name === "" ? "Anonymous" : msg.name}</cite>
<time datetime="${new Date(msg.timestamp)}">${new Date(msg.timestamp).getHours() + ":" + new Date(msg.timestamp).getMinutes()}</time>
<button class="msg-delete" onclick="deleteMessagePressed(${msg.id})">x</button>
</div>
<div class="msg">${msg.message}</div>
</div>`;

    return row;
}


function submitNewMessage(event, element) {
    event.preventDefault();
    if (element.elements[0].value.length === 0) {
        return;
    }

    let userInfo = UserInfo.getFromStorage();
    let newMessage = {
        "message": element.elements[0].value,
        "name": userInfo.getName(),
        "email": userInfo.getEmail(),
        "timestamp": Date.now()
    };

    element.elements[0].value = "";
    element.elements[0].style.cssText = 'height:70px';
    Babble.postMessage(newMessage, function (message) {
        message = JSON.parse(message);
        if (document.querySelector(`.chat-message[msgId="${message.id}"]`) === null) {
            document.getElementById("chatMessages").append(createMsgElement(message));
        }
        document.querySelector(".chat-room main").scrollTop = document.querySelector(".chat-room main").scrollHeight;
        refreshStats();
    });
}

function deleteMessagePressed(msgId) {
    Babble.deleteMessage(msgId, function () {
        let deletedDiv = document.querySelector(`.chat-message[msgId="${msgId}"]`);
        if (deletedDiv !== null) {
            deletedDiv.parentElement.removeChild(deletedDiv);
        }
        refreshStats();
    }.bind(this));
}

function loginWithNameAndEmail() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    Babble.register({"name": name, "email": email});
    document.getElementById("login").style.cssText = "display:none";
}

function loginAnonymously() {
    Babble.register({name: "", email: ""});
    document.getElementById("login").style.cssText = "display:none";
}


Babble.register = function (data) {
    new UserInfo(data.name, data.email).saveInStorage();
    request({method: "post", action: "register", data: data}).then(function (data) {
    }, function (error) {
        console.error("Babble.register", "Error when trying to register", error);
    });
};

Babble.getMessages = function (counter, callback) {
    request({method: "get", action: "messages?counter=" + counter}).then(function (data) {
        callback(data);
    }, function (error) {
        console.error("Babble.getMessages", "Error when trying to get messages: ", counter, error);
    });
};

Babble.postMessage = function (message, callback) {
    request({method: "post", action: "messages", data: message}).then(function (data) {
        callback(data)
    }, function (error) {
        console.error("Babble.postMessage", "Error when trying to add new message: ", message, error);
    });
};

Babble.deleteMessage = function (id, callback) {
    request({method: "delete", action: "messages/" + id}).then(function (data) {
        callback(data)
    }, function (error) {
        console.error("Babble.deleteMessage", "Error when trying to delete existing message: ", id, error);
    });
};

Babble.getStats = function (callback) {
    request({method: "get", action: "stats"}).then(function (data) {
        callback(data);
    }, function (error) {
        console.error("Babble.getStats", "Error when trying to get stats", error);
    });
};


Babble.messages = [];


function refreshStats() {
    Babble.getStats(function (stats) {
        stats = JSON.parse(stats);
        document.getElementById("numberOfMessages").innerText = stats.messages + "";
        document.getElementById("numberOfUsers").innerText = stats.users + "";
    })
}

function getMessagesFromServer() {
    Babble.getMessages(Babble.messages.length, function (messages) {
        messages = JSON.parse(messages);
        console.log(messages.length);
        for (let i = 0; i < messages.length; i++) {
            if (document.querySelector(`.chat-message[msgId="${messages[i].id}"]`) === null) {
                document.getElementById("chatMessages").append(createMsgElement(messages[i]));
            }
        }
        document.querySelector(".chat-room main").scrollTop = document.querySelector(".chat-room main").scrollHeight;
        Babble.messages = Babble.messages.concat(messages);

        refreshStats();
        getMessagesFromServer();
    })
}

window.onload = function () {
    if (document.querySelector(".babble-body") === null) {
        console.log("testing environment");
        return
    }

    getMessagesFromServer();
    refreshStats();
};

'use strict';

let messageUtils = {};

messageUtils.messages = [];
messageUtils.generateNewId = function () {
    let maxId = 0;
    for (let i = 0; i < this.messages.length; i++) {
        if (maxId < this.messages[i].id) {
            maxId = this.messages[i].id;
        }
    }
    return maxId + 1;
};
messageUtils.addMessage = function (message) {
    let newMessage = {
        "id": this.generateNewId(),
        "name": message.name,
        "email": message.email,
        "message": message.message,
        "timestamp": message.timestamp
    };
    messageUtils.messages.push(newMessage);
    return newMessage;
};
messageUtils.getMessages = function (counter) {
    if (messageUtils.messages.length > counter) {
        return messageUtils.messages.slice(counter)
    }
    return [];
};
messageUtils.deleteMessage = function (id) {
    for(let i=0; i<messageUtils.messages.length; i++){
        if(this.messages[i].id === id){
            messageUtils.messages.slice(0, i).concat(messageUtils.messages.slice(i + 1))
            return true;
        }
    }
    return false;
};
module.exports = messageUtils;
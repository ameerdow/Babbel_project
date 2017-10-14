'use strict';

function Message (id, name, email, message, timestamp) {

    let _id = id;
    let _name = name;
    let _email = email;
    let _message = message;
    let _timestamp = timestamp;


    this.getMessage = function(){
        return {
            "id": _id,
            "name" : _name,
            "email" : _email,
            "message": _message,
            "timestamp": _timestamp
        };
    }
};
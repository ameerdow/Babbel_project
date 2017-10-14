function Message (id, name, email, message, timestamp) {

    var _id = id;
    var _name = name;
    var _email = email;
    var _message = message;
    var _timestamp = timestamp; 


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
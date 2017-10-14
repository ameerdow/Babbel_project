function Message (name, email, message, timestamp) {

    var _name = name;
    var _email = email;
    var _message = message;
    var _timestamp = timestamp; 


    this.getMessage = function(){
        return {
            "name" : _name,
            "email" : _email,
            "message": _message,
            "timestamp": _timestamp
        };
    }
};
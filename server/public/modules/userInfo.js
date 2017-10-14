function userInfo(name, email){
    var _name = name;
    var _email = email;

    this.getUser = function(){
        return {
            "name" : _name,
            "email" : _email
        };
    }

}
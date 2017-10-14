'use strict';

function UserInfo(name, email) {
    let _name = name;
    let _email = email;

    this.toJson = function () {
        return {
            "name": _name,
            "email": _email
        };
    };

    this.saveInStorage = function () {
        let data = Babble.storage.getData();
        data.userInfo = this.toJson();
        Babble.storage.setData(data);
    };

    this.getName =function () {
        return _name;
    };
    this.getEmail =function () {
        return _email;
    };
}

UserInfo.getFromStorage = function () {
    let userInfo = Babble.storage.getData().userInfo;
    return new UserInfo(userInfo.name, userInfo.email);
};
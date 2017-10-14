function UserInfo(name, email) {
    let _name = name;
    let _email = email;

    this.getUser = function () {
        return {
            "name": _name,
            "email": _email
        };
    };

    this.saveInStorage = function () {
        let data = Babble.storage.getData();
        data.userInfo = this.getUser();
        Babble.storage.setData(data);
    };
}
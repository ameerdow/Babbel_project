'use strict';

function BabbleStorage() {
    const KEY = "babble";
    const DEFAULT_DATA = JSON.stringify({currentMessage: "", userInfo: new UserInfo("", "").toJson()});
    localStorage.clear();
    localStorage.setItem(KEY,DEFAULT_DATA);

    this.setData = function (data) {
        localStorage.setItem(KEY, JSON.stringify(data));
    };

    this.getData = function () {
        let data = localStorage.getItem(KEY);
        if (data !== null) {
            return JSON.parse(data);
        }
        this.setData(DEFAULT_DATA);
        return JSON.parse(DEFAULT_DATA);
    };
}

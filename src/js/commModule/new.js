define(function(require, exports, module) {

    var new_tip = function(ver, user) {

        var oldTime = localStorage.getItem('key') && localStorage.getItem('key').split('=')[1];

        if (arguments.length == 0 && !oldTime) return;

        var loginTime = moment().format('L');

        if (oldTime) {

            if (ver != undefined) { //新版本发布的情况

                if (localStorage.getItem('key').split('&')[0] != ver) { //不等于老版本重新设置首次登陆时间

                    localStorage.setItem('key', ver + "&" + user + '=' + loginTime)
                }

            } else {

                if (moment(oldTime).add(3, 'days').isBefore(moment(loginTime))) {
                    $('.new').removeClass('new');
                }
            }

        } else {

            localStorage.setItem('key', ver + "&" + user + '=' + loginTime);
        }
    };
    module.exports = new_tip;
});
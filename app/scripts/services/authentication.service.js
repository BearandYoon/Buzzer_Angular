angular
    .module('bzrdashApp')
    .service("authenticationService", ["$http", "$q", "$window", 'SERVERURL',
        function ($http, $q, $window, SERVERURL) {
            var userInfo;

            function getLoginInfo() {
                return 'Login Date: ' + new Date().toUTCString() + ' IP Address: ' + myIp;
            }

            function login(userName, password) {
                console.log(userName, password)
                var deferred = $q.defer();

                $http({
                    url: SERVERURL.url + 'login',
                    method: 'POST',
                    data: { username: userName, password: password },
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                })
                    .then(function (result) {
                        userInfo = result.data;
                        userInfo.roleName = userInfo.roleName || "Admin";
                        ga('send', 'event', 'Login', userInfo.username, getLoginInfo(), Date.now().toString());
                        $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                        deferred.resolve(userInfo);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function signUp(object) {
                var deferred = $q.defer();

                $http({
                    url: SERVERURL.url + 'register',
                    method: 'POST',
                    data: object,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                })
                    .then(function (result) {
                        userInfo = result.data;
                        $window.sessionStorage["userInfo"] = JSON.stringify(result.data);
                        deferred.resolve(userInfo);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function logout() {
                var deferred = $q.defer();

                $http({
                    method: "GET",
                    url: SERVERURL.url + 'logout',
                    headers: {
                        "access_token": userInfo.accessToken
                    }
                }).then(function (result) {
                    userInfo = null;
                    $window.sessionStorage["userInfo"] = null;
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function lock() {
                var deferred = $q.defer();

                var info = JSON.parse($window.sessionStorage["userInfo"]);
                info.loginToken = '';

                $http({
                    method: "GET",
                    url: SERVERURL.url + 'logout',
                    headers: {
                        "access_token": userInfo.accessToken
                    }
                }).then(function (result) {
                    userInfo = info;
                    $window.sessionStorage["userInfo"] = JSON.stringify(info);
                    deferred.resolve(result);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function getUserInfo() {
                return userInfo;
            }

            function forgot(userName) {
                return $http({
                    url: SERVERURL.url + 'forgotPassword/?username=' + userName,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            }

            function reset(password, resetToken) {
                return $http({
                    url: SERVERURL.url + 'forgotPassword/reset/?password=' + password + '&resetToken=' + resetToken,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            }

            function init() {
                if ($window.sessionStorage["userInfo"]) {
                    userInfo = JSON.parse($window.sessionStorage["userInfo"]);
                }
            }
            init();

            return {
                login: login,
                logout: logout,
                lock: lock,
                getUserInfo: getUserInfo,
                signUp: signUp,
                forgot: forgot,
                reset: reset
            };
        }]);



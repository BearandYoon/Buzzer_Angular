angular.module('bzrdashApp').service("userManagementService", ["$http", '$q', 'SERVERURL', 'authenticationService',
    function ($http, $q, SERVERURL, authenticationService) {

        function getUsers() {
            return $http.get(SERVERURL.url + '/roles/users/' + authenticationService.getUserInfo().loginToken).then(function (res) {
                return res.data;
            });
        }
        function getRoles() {
            return $http.get(SERVERURL.url + 'roles/all/' + authenticationService.getUserInfo().loginToken).then(function (res) {
                return res.data;
            });
        }
        function getPermissions() {
            return $http.get(SERVERURL.url + 'roles/permissions/' + authenticationService.getUserInfo().loginToken).then(function (res) {
                return res.data;
            });
        }
        function saveUser(username, rolename) {
            return $http.post(SERVERURL.url + 'roles/saveUser/' + authenticationService.getUserInfo().loginToken,
                { username: username, rolename: rolename })
                .then(function (res) {
                    return res.data;
                });
        }
        function saveRole(role) {
            return $http.post(SERVERURL.url + 'roles/saveRole/' + authenticationService.getUserInfo().loginToken, { role: role })
                .then(function (res) {
                    return res.data;
                });
        }
        return {
            getUsers: getUsers,
            getRoles: getRoles,
            getPermissions: getPermissions,
            saveUser: saveUser,
            saveRole: saveRole
        };
    }]);
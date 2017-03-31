angular
    .module('bzrdashApp')
    .service('StaffService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

            var StaffService = {};

            StaffService.getStaff = function () {
                return $http.get(SERVERURL.url + 'staff/' + authenticationService.getUserInfo().loginToken).then(function(res) {
                    return res.data;
                });
            };

            StaffService.addStaff = function (staff) {
                return $http.post(SERVERURL.url + 'staff/' + authenticationService.getUserInfo().loginToken, staff)
                    .then(function(res) {
                        return res.data;
                    });
            };

            StaffService.editStaff = function (staff) {
                return $http.post(SERVERURL.url + 'staff/edit/' + authenticationService.getUserInfo().loginToken, staff)
                    .then(function(res) {
                        return res.data;
                    });
            };

            return StaffService;
        }]);


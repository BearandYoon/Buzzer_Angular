angular
    .module('bzrdashApp')
    .service('UserSettingsService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

        var UserSettingsService = {};

        UserSettingsService.setUserSettings = function (data) {
            return $http
                .post(
                    SERVERURL.url + 'userSettings/' + authenticationService.getUserInfo().loginToken,
                    data
                )
                .then(function(res) {
                    return res.data;
                });
        };

        return UserSettingsService;
    }]);

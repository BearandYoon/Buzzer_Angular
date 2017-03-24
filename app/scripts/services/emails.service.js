angular
    .module('bzrdashApp')
    .service('EmailsService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

            var EmailsService = {};

            EmailsService.getEmails = function () {
                return $http.get(SERVERURL.url + 'emails/' + authenticationService.getUserInfo().loginToken).then(function(res) {
                    return res.data;
                });
            };
            return EmailsService;
        }]);


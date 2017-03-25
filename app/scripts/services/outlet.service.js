angular
    .module('bzrdashApp')
    .service('OutletService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

        var OutletService = {};

        OutletService.getOutlet = function () {
            return $http.get(SERVERURL.url + 'getOutlet/' + authenticationService.getUserInfo().loginToken).then(function(res) {
                return res.data;
            });
        };

        return OutletService;
    }]);


angular
    .module('bzrdashApp')
    .service('MapService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

        var MapService = {};

        MapService.getLocations = function () {
            return $http.get(SERVERURL.url + 'getLocations/' + authenticationService.getUserInfo().loginToken).then(function(res) {
                return res.data;
            });
        };

        MapService.getMappositions = function (postcode) {
            return $http.get('http://postcodes.getbuzzer.com/postcodes/' + postcode).then(function(res) {
                return res.data;
            });
        };

        return MapService;
    }]);


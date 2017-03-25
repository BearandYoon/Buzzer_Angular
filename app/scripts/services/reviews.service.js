angular
    .module('bzrdashApp')
    .service('ReviewsService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

            var ReviewsService = {};

            ReviewsService.getReviews = function () {
                return $http.get(SERVERURL.url + 'getReviews/' + authenticationService.getUserInfo().loginToken,
                    { allowDateFilter: true }).then(function (res) {
                        return res.data;
                    });
            };

            ReviewsService.getResponseRate = function () {
                return $http.get(SERVERURL.url + 'getResponseRate/' + authenticationService.getUserInfo().loginToken,
                { allowDateFilter: true }).then(function (res) {
                    return res.data;
                });
            };

            return ReviewsService;
        }]);


angular
    .module('bzrdashApp')
    .service('FeedbacksService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

            var FeedbacksService = {};

            FeedbacksService.getFeedbacks = function () {
                return $http.get(SERVERURL.url + 'feedbacks/' + authenticationService.getUserInfo().loginToken,
                    { allowDateFilter: true }).then(function (res) {
                        return res.data;
                    });
            };

            FeedbacksService.getNPS = function () {
                return $http.get(SERVERURL.url + 'getNPS/' + authenticationService.getUserInfo().loginToken,
                    { allowDateFilter: true }).then(function (res) {
                        return res.data;
                    });
            };

            FeedbacksService.getFeedbacksContent = function (offset, limit) {
                var params = {
                    offset: offset || 0
                };
                if (limit) {
                    params.limit = limit;
                }
                return $http.get(SERVERURL.url + 'feedbacks/content/' + authenticationService.getUserInfo().loginToken,
                  { allowDateFilter: true, params: params}).then(function (res) {
                    return res.data;
                });
            };

            FeedbacksService.getServers = function () {
                return $http.get(SERVERURL.url + 'getServers/' + authenticationService.getUserInfo().loginToken,
                    { allowDateFilter: true }).then(function (res) {
                        return res.data;
                    });
            };

            return FeedbacksService;
        }]);


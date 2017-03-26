angular
    .module('bzrdashApp')
    .service('WeeklySnapshotService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

        var WeeklySnapshotService = {};

        WeeklySnapshotService.getWeeklySnapshots = function () {
            return $http.get(SERVERURL.url + 'getWeeklySnapshots/' + authenticationService.getUserInfo().loginToken,
            { allowDateFilter: true }).then(function(res) {
                return res.data;
            });
        };

        return WeeklySnapshotService;
    }]);


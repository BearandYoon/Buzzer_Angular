angular.module('bzrdashApp').controller('dateFillterCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    let start = moment().subtract(6, 'days');
    let end = moment();
    $scope.filterDate = {
        startDate: start,
        endDate: end
    };

    $scope.$watch("filterDate", function() {
        var duration = moment.duration($scope.filterDate.endDate.diff($scope.filterDate.startDate));
        var days = duration.asDays();
        $scope.setDay(Math.round(days));
    });

    $scope.setDay = function (days) {
        $rootScope.dateFilter.lastNDays = days;
        console.log($rootScope.dateFilter.lastNDays);
    };
}]);
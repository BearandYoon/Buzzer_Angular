'use strict';

function dataRawController($scope, $q, $filter, $http, $rootScope, FeedbacksService, QuestionsService) {
    $scope.getDate = function (created_at) {
        var date = new Date(created_at);
        date = date.toString();
        var newDate = date.split(/\s+/).slice(1, 5);
        return {
            date: newDate[0] + ' ' + newDate[1] + ' ' + newDate[2],
            time: newDate[3]
        };
    };



    $scope.getAllData = function () {
        if ($scope.busy) { return; }
        $scope.busy = true;
        if ($scope.showLoading) {
            $scope.showLoading();
        }

        var offset = 0;
        if ($scope.feedbacks) {
            offset = $scope.feedbacks.length;
        }
        
        $q.all([
            FeedbacksService.getFeedbacksContent(offset, 50)
        ]).then(function (data) {
            if ($scope.feedbacks) {
                $scope.feedbacks = $scope.feedbacks.concat(data[0].feedbacks);
            } else {
                $scope.feedbacks = data[0].feedbacks;
            }
            if ($scope.hideLoading) {
                $scope.hideLoading();
            }
            $scope.busy = false;
        })
    }
    $scope.getAllData();
    $rootScope.$watch('dateFilter.lastNDays', function () {
        $scope.getAllData();
    });
}

angular
    .module('bzrdashApp')
    .controller('dataRawController', ['$scope', '$q', '$filter', '$http', '$rootScope', 'FeedbacksService', 'QuestionsService', dataRawController]);

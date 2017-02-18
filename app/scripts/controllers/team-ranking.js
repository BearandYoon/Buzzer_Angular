'use strict';

function teamRankingCtrl($scope, $rootScope, teamRankingService, $stateParams) {
	$scope.Math = window.Math;

	$scope.propName = 'feedbackCount';
	$scope.reverse = true;

	if ($stateParams.topId) {
		$scope.propName = function (staff) {
			return staff._id === $stateParams.topId;
        };
	}

	$scope.arrowStyleClass = 'fa-caret-up';
	$scope.sortBy = function (propName) {
		$scope.reverse = ($scope.propName === propName) ? !$scope.reverse : false;
		$scope.propName = propName;
		$scope.arrowStyleClass = $scope.reverse ? 'fa-caret-down' : 'fa-caret-up';
	}

	$scope.getAllData = function () {
		if ($scope.showLoading) {
		    $scope.showLoading();
		}
		teamRankingService.getData().then(function (data) {
			$scope.staffList = data;
			if ($scope.hideLoading) {
				$scope.hideLoading();
			}
		});
	}
	$scope.getAllData();
	$rootScope.$watch('dateFilter.lastNDays', function () {
        $scope.getAllData();
    });

	$scope.generatePdf = function (staff) {
		pdfMake.createPdf({
			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [40, 100, 40, 60],
			content: [
				{text: 'Title', style: 'header', alignment: 'center', fontSize: 40, bold: true},
                {text: staff.fname + ' ' + staff.lname, alignment: 'center', fontSize: 80, margin: [0, 50]},
                {text: staff.award, alignment: 'center', fontSize: 30, margin: [0,40], bold: true},
                {text: (new Date()).toDateString(), alignment: 'center', fontSize: 20, margin: [0,50], bold: true}
			]
		}).open();
    }
}

angular
	.module('bzrdashApp')
	.controller('teamRankingCtrl', ['$scope', '$rootScope', 'teamRankingService', '$stateParams', teamRankingCtrl]);

'use strict';

function loadingCaptionCtrl($scope, $timeout) {
	$scope.isLoadingVisible = false;
	$scope.loadingAnimClass = 'loading-hidden';

	$scope.showLoading = function () {
		$scope.isLoadingVisible = true;
		$timeout(function () {
			$scope.loadingAnimClass = 'loading-visible';
		}, 0);

	};

	$scope.hideLoading = function () {
		$scope.loadingAnimClass = 'loading-hidden';
		$timeout(function () {
			$scope.isLoadingVisible = false;
		}, 300);
	};

}

angular
	.module('bzrdashApp')
	.controller('loadingCaptionCtrl', ['$scope', '$timeout', loadingCaptionCtrl]);

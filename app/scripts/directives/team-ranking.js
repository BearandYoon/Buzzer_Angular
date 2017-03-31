'use strict';

/*
 * vector - jvectormap directive
 */
function teamRanking() {
	return {
		restrict: 'AE',
		controller: 'teamRankingCtrl'
	};
}

angular.module('bzrdashApp').directive('teamRanking', teamRanking);

'use strict';

/*
 * preloader - loading indicator directive
 */
function loading() {
	return {
		restrict: 'EA',
		templateUrl: './views/loading-caption.html',
		replace: true,
		scope: false
	};
}

angular.module('bzrdashApp').directive('loadingCaption', loading);

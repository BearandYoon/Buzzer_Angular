'use strict';
function spinnerButton() {
    return {
        restrict: 'EA',
        templateUrl: './views/spinner-button.html',
        replace: true,
        scope: {
            processed: '=',
            onSaving: '&',
            text: '@',
        },
        link: function(scope, elem) {
            scope.processing = false;
            scope.onButtonClicked = function() {
                scope.processing = true;
                scope.onSaving();
            }
            scope.$watch('processed', function(next, cur) {
                if (next) {
                    scope.processing = false;
                }
            });
        }
    };
}

angular.module('bzrdashApp').directive('spinnerButton', spinnerButton);

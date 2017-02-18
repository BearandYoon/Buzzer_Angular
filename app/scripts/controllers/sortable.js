'use strict';

function sortableCtrl($scope) {
  $scope.sortableOpt = {
    placeholder: 'ui-state-highlight',
    connectWith: '.connectedSortable'
  };
}

angular
  .module('bzrdashApp')
  .controller('sortableCtrl', ['$scope', sortableCtrl]);

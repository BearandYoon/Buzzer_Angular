'use strict';

function maskCtrl($scope) {
  $scope.maskOpt = {
    autoclear: false
  };
}

angular
  .module('bzrdashApp')
  .controller('maskCtrl', ['$scope', maskCtrl]);

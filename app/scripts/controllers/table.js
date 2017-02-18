'use strict';

function tableCtrl($scope) {
  $scope.dataTableOpt = {
    'ajax': 'data/datatables-arrays.json'
  };
}

angular
  .module('bzrdashApp')
  .controller('tableCtrl', ['$scope', tableCtrl]);

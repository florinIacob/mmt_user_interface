'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:EditExpensePopupController
 * @description
 * # EditExpensePopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('EditExpensePopupController', ['$scope', '$uibModalInstance', 'items',
        function ($scope, $uibModalInstance, items) {

   $scope.items = items;

   $scope.yes = function() {
       items.onYesCallback();
       $uibModalInstance.dismiss('cancel');
   };

   $scope.no = function() {
       $uibModalInstance.dismiss('cancel');
   };

}]);

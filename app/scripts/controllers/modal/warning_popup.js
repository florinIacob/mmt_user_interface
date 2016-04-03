'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:WarningPopupController
 * @description
 * # WarningPopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('WarningPopupController', ['$scope', '$uibModalInstance', 'items',
        function ($scope, $uibModalInstance, items) {

   $scope.items = items;

   $scope.yes = function() {
       items.onYesCallback();
       //$uibModalInstance.close($scope.theThingIWantToSave);
   };

   $scope.no = function() {
       $uibModalInstance.dismiss('cancel');
   };

}]);

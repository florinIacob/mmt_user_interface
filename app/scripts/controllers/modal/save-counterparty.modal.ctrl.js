'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:EditExpensePopupController
 * @description
 * # EditExpensePopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('SaveCounterpartyModalCtrl', ['$scope', '$q', 'CounterpartyFactory',
                       '$uibModal', '$uibModalInstance', 'ModalTemplateService', 'counterpartyEntity',
        function ($scope, $q, CounterpartyFactory, $uibModal, $uibModalInstance, ModalTemplateService, counterpartyEntity) {

  $scope.loading = false;
  $scope.isEditMode = false;
  if (counterpartyEntity) {
    $scope.isEditMode = true;
    $scope.counterparty = {};
    angular.copy(counterpartyEntity, $scope.counterparty);
  } else {
    $scope.counterparty = {
      id: null,
      name: null,
      email: null
    }
  }

   // submit button - save the counterparty
   $scope.saveCounterparty = function() {
       var serverRequestArray = [];
       if ($scope.isEditMode) {
          serverRequestArray.push(CounterpartyFactory.updateCounterparty($scope.counterparty));
       } else {
          serverRequestArray.push(CounterpartyFactory.addCounterparty($scope.counterparty));
       }

       $scope.loading = true;

       // make server request
       $q.all(serverRequestArray).then(
         // SUCCESS callback
         function success(responseCounterpartyArray){
            $scope.loading = false;
            if ($scope.isEditMode) {
               $uibModalInstance.close($scope.counterparty);
            } else {
               $uibModalInstance.close(responseCounterpartyArray[0]);
            }
         },
         // ERROR callback
         function error(response){
           $uibModal.open({
             animation: true,
             templateUrl: 'views/modal/info-modal.html',
             controller: 'WarningPopupController',
             resolve: {
               items: function() {
                 return {
                   title: 'Information!',
                   message: 'Error saving counterparty!',
                   onYesCallback: null
                 };
               },
             }
           });
           console.error('Error saving counterparty!\n' + JSON.stringify(response.data));
        });
   }

   // Cancel button
   $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
   }
}]);

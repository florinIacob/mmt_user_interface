'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:EditIncomePopupController
 * @description
 * # EditIncomePopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('EditIncomePopupController', ['$scope', '$http','$cookieStore', 'DateTimeService', 'CurrencyUtilFactory',
                       '$uibModal', '$uibModalInstance', 'ModalTemplateService', 'host_name', 'items',
        function ($scope, $http, $cookieStore, DateTimeService, CurrencyUtilFactory, $uibModal, $uibModalInstance,
                  ModalTemplateService, host_name, items) {

  $scope.loading = false;
   $scope.income = items.income;
   $scope.current_date_value = DateTimeService.createDateTimeString(new Date($scope.income.creationDate));
   var old_date = $scope.income.creationDate;
   $scope.income.creationDate = null;

   $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();

   // submit button - save the income
   $scope.submit = function() {
       if ($scope.income.creationDate == null) {
          $scope.income.creationDate = new Date(old_date);
        }
       var submitted_income = $scope.income;

      $scope.loading = true;
       // prepare post request
       var req = {
          method: 'POST',
          url: host_name + '/income/update/' + submitted_income.id,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(submitted_income)
       }
       // make server request
       $http(req).then(
         // SUCCESS callback
         function(response){
           items.afterEditCallback();
           $uibModalInstance.dismiss('cancel');
           $scope.loading = false;
         },
         // ERROR callback
         function(response){
           $uibModal.open({
             animation: true,
             template: ModalTemplateService.getInfoTemplate(),
             controller: 'WarningPopupController',
             resolve: {
               items: function() {
                 return {
                   title: 'Information!',
                   message: 'Income not saved!\n' + JSON.stringify(response.data),
                   onYesCallback: null
                 };
               },
             }
           });
           $scope.loading = false;
        });
   }

   // Cancel button
   $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
   }

}]);

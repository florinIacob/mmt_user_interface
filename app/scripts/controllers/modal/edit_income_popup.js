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

   var old_date = $scope.income.creationDate;
   $scope.income.creationDate = new Date($scope.income.creationDate);
   if (!$scope.income.frequency) {
      $scope.income.frequency = 0;
   } else {
      $scope.income.frequency = parseInt($scope.income.frequency);
   }

   $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();
   $scope.availableFrequencies = [
      {value:0, text: 'Only once'},
      {value:1, text: 'Monthly'},
      {value:2, text: 'Every 2 months'},
      {value:3, text: 'Quarterly'},
      {value:6, text: 'Every 6 months'},
   ];

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
             templateUrl: 'views/modal/info-modal.html',
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

   /*---- Start DATE PICKER ----*/
   $scope.format = 'dd-MMMM-yyyy';
   $scope.altInputFormats = ['M!/d!/yyyy'];

   $scope.datePopup = {
     opened: false
   };
   $scope.openDatePicker = function() {
     $scope.datePopup.opened = true;
   };
   $scope.dateOptions = DateTimeService.getDateOptions();
   /*---- End DATE PICKER ----*/

}]);

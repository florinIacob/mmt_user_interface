'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddIncomeCtrl
 * @description
 * # AddIncomeCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddIncomeCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, DateTimeService,
         $uibModal, ModalTemplateService, host_name, CurrencyUtilFactory) {

  if (!$rootScope.authenticated) {
      $location.path('/login');
  }

  $scope.current_date_value = DateTimeService.createCurrentDateTimeString();
  console.log($scope.current_date_value);

  $scope.income = {
     id: 0,
     name: "",
     description: "",
     amount: null,
     creationDate: null,
     currency: null
  }

  $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();

  CurrencyUtilFactory.getDefaultCurrency().then(
    function(response){
      var currency = angular.fromJson(response.data);
      $scope.income.currency = currency.value;
    },
    function(response){
      // ERROR: inform the user
      console.error("[add_income] Cannot retrieve defaul Currency for Reason: " + JSON.stringify(response));
   });

  // submit button - save the expense
  $scope.submit = function() {
      var submitted_income = $scope.income;
      if (submitted_income.creationDate == null) {
        submitted_income.creationDate = new Date();
      }

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name +'/income/add',
         headers: {
           'Content-Type': "application/json",
           'Authorization': $cookieStore.get('mmtlt')
         },
         data: JSON.stringify(submitted_income)
      }
      // make server request
      $http(req).then(
        function(response){
          // SUCCESS: change the path
          $location.path('/incomes_history')
        },
        function(response){

          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Information!',
                  message: 'Income not created! Please use another income name!',
                  onYesCallback: null
                };
              },
            }
          });
       });
  }
});

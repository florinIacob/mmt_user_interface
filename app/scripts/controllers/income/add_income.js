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
  $scope.loading = false;

  $scope.current_date_value = DateTimeService.createCurrentDateTimeString();
  console.log($scope.current_date_value);

  $scope.income = {
     id: 0,
     name: "",
     description: "",
     amount: null,
     frequency: 0,
     creationDate: new Date(),
     currency: null
  }

  $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();
  $scope.availableFrequencies = [
     {value:0, text: 'Only once'},
     {value:1, text: 'Monthly'},
     {value:2, text: 'Every 2 months'},
     {value:3, text: 'Quarterly'},
     {value:6, text: 'Every 6 months'},
  ];

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

      $scope.loading = true;

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
          $scope.loading = false;
          $location.path('/incomes_history')
        },
        function(response){

          $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/info-modal.html',
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
          $scope.loading = false;
       });
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

});

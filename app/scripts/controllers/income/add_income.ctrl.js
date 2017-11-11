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

  $scope.commonIncome = {
      id: 0,
      name: "",
      description: "",
      frequency: 0,
      currency: null,
      amount: null,
      creationDate: new Date()
  };

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
      $scope.commonIncome.currency = currency.value;
    },
    function(response){
      // ERROR: inform the user
      console.error("[add_income] Cannot retrieve defaul Currency for Reason: " + JSON.stringify(response));
   });


  /*---- Start DATE PICKER ----*/
  $scope.format = 'dd-MMMM-yyyy';
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.datePopup = [{
    opened: false
  }];
  $scope.openDatePicker = function(index) {
    $scope.datePopup[index].opened = true;
  };
  $scope.dateOptions = DateTimeService.getDateOptions();
  /*---- End DATE PICKER ----*/


  // submit button - save the expense
  $scope.submit = function() {

      $scope.loading = true;

      var incomesToSubmit = [];
      incomesToSubmit.push($scope.commonIncome);

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name +'/income/add',
         headers: {
           'Content-Type': "application/json",
           'Authorization': $cookieStore.get('mmtlt')
         },
         data: JSON.stringify(incomesToSubmit)
      };
      // make server request
      $http(req).then(
        function(response){
          // SUCCESS: change the path
          $scope.loading = false;
          $location.path('/incomes_history')
        },
        function(response){

          console.error((response && response.data) ? JSON.stringify(response.data) : "Invalid income");
          $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/info-modal.html',
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Information!',
                  message: 'Income not created! Invalid request!',
                  onYesCallback: null
                };
              }
            }
          });
          $scope.loading = false;
       });
  }

});

'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddExpenseCtrl
 * @description
 * # AddExpenseCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddExpenseCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, CategoryService, DateTimeService,
       $uibModal, ModalTemplateService, host_name, CurrencyUtilFactory) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.loading = false;

  $scope.newCategory = null;
  $scope.categories = [];
  $scope.categories = CategoryService.getCategoryNames();

  $scope.commonExpense = {
     id: 0,
     name: "",
     category: {
        name: ""
     },
     description: "",
     frequency: 0,
     amount: null,
     creationDate: new Date(),
     currency: null
  };

  $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();
  $scope.availableFrequencies = [
     {value:0, text: 'Only once'},
     {value:1, text: 'Monthly'},
     {value:2, text: 'Every 2 months'},
     {value:3, text: 'Quarterly'},
     {value:6, text: 'Every 6 months'},
  ];

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

  CurrencyUtilFactory.getDefaultCurrency().then(
    function(response){
      var currency = angular.fromJson(response.data);
      $scope.commonExpense.currency = currency.value;
    },
    function(response){
      // ERROR: inform the user
      console.error("[add_income] Cannot retrieve defaul Currency for Reason: " + JSON.stringify(response));
   });

  // submit button - save the expense
  $scope.submit = function() {

      $scope.loading = true;

      var expensesToSubmit = [];
      expensesToSubmit.push($scope.commonExpense);

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/expense/add',
         headers: {
           'Content-Type': "application/json",
           'Authorization': $cookieStore.get('mmtlt')
         },
         data: JSON.stringify(expensesToSubmit)
      };
      // make server request
      $http(req).then(
        function success(response){
          // SUCCESS: change the path
          $scope.loading = false;
          if (response.data && response.data.notification) {
            $rootScope.totalNotifications++;
          }
          $location.path('/expenses_history');
        },
        function error(response){
          $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/info-modal.html',
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Information!',
                  message: 'Expense not created! Error on creating the expense!',
                  onYesCallback: null
                };
              }
            }
          });
          $scope.loading = false;
       });
  };

  $scope.addCategory = function() {
    CategoryService.addCategoryName($scope.newCategory, $scope.categories);
    $scope.commonExpense.category.name = $scope.newCategory;
    $scope.newCategory = null;
  }

});

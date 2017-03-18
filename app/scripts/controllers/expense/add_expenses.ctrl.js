'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AddExpenseCtrl
 * @description
 * # AddExpensesCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AddExpensesCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, CategoryService, DateTimeService,
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
  }

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

  /**-------------- Start: Multiple expenses features ---------------*/
  $scope.expensesArray = [
    {amount: null, creationDate: null}
  ];

  $scope.addAnotherExpense = function() {
    $scope.expensesArray.push({amount: null, creationDate: null});
    $scope.datePopup.push({opened: false});
  }
  /**----------------- End: Multiple expenses features ---------------*/

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
      angular.forEach($scope.expensesArray, function(expense, index) {
        var expenseToAdd = {};
        expenseToAdd.id = $scope.commonExpense.id;
        expenseToAdd.name = $scope.commonExpense.name;
        expenseToAdd.category = $scope.commonExpense.category;
        expenseToAdd.description = $scope.commonExpense.description;
        expenseToAdd.frequency = $scope.commonExpense.frequency;
        expenseToAdd.currency = $scope.commonExpense.currency;
        expenseToAdd.amount = expense.amount;
        expenseToAdd.creationDate = expense.creationDate;
        expensesToSubmit.push(expenseToAdd);
      });

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/expense/add',
         headers: {
           'Content-Type': "application/json",
           'Authorization': $cookieStore.get('mmtlt')
         },
         data: JSON.stringify(expensesToSubmit)
      }
      // make server request
      $http(req).then(
        function success(response){
          // SUCCESS: change the path
          $scope.loading = false;
          $location.path('/expenses_history')
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
                  message: 'Expense not created! Please choose a category \nor use another expense name!',
                  onYesCallback: null
                };
              },
            }
          });
          $scope.loading = false;
       });
  }

  $scope.addCategory = function() {
    CategoryService.addCategoryName($scope.newCategory, $scope.categories);
    $scope.commonExpense.category.name = $scope.newCategory;
    $scope.newCategory = null;
  }

});

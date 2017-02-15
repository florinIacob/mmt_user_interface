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

  $scope.current_date_value = DateTimeService.createCurrentDateTimeString();
  console.log($scope.current_date_value);

  $scope.expense = {
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

  CurrencyUtilFactory.getDefaultCurrency().then(
    function(response){
      var currency = angular.fromJson(response.data);
      $scope.expense.currency = currency.value;
    },
    function(response){
      // ERROR: inform the user
      console.error("[add_income] Cannot retrieve defaul Currency for Reason: " + JSON.stringify(response));
   });

  // submit button - save the expense
  $scope.submit = function() {
      var submitted_expense = $scope.expense;
      if (submitted_expense.creationDate == null) {
        submitted_expense.creationDate = new Date();
      }

      $scope.loading = true;
      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/expense/add',
         headers: {
           'Content-Type': "application/json",
           'Authorization': $cookieStore.get('mmtlt')
         },
         data: JSON.stringify(submitted_expense)
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
            template: ModalTemplateService.getInfoTemplate(),
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
    $scope.expense.category.name = $scope.newCategory;
    $scope.newCategory = null;
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

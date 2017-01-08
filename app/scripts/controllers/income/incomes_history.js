'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:IncomesHistoryCtrl
 * @description
 * # IncomesHistoryCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('IncomesHistoryCtrl', function ($scope, $rootScope, $http, $location, $route, $cookieStore,
        $uibModal, ModalTemplateService, IncomeUtilFactory, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.incomeFromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  $scope.incomeUntilDate = new Date();

  $scope.loading = true;

  $scope.incomes = [];

  /**
   * Retrieve the List of Incomes
   *
   */
  $scope.retrieveIncomeList = function() {
    if (!$scope.incomeFromDate) {
      $scope.incomeFromDate = new Date(new Date().getFullYear(), 0, 1);
    }
    if (!$scope.incomeUntilDate) {
      $scope.incomeUntilDate = new Date();
    }
    $scope.loading = true;

    IncomeUtilFactory.retrieveIncomesByTimeInterval('*', $scope.incomeFromDate.getTime(), $scope.incomeUntilDate.getTime()).then(
      function success(response){
        if (response && response.data) {
          $scope.incomes = angular.fromJson(response.data);
        }
        $scope.loading = false;
      },
      function error(response){
        // ERROR: inform the user
        $uibModal.open({
          animation: true,
          template: ModalTemplateService.getInfoTemplate(),
          controller: 'WarningPopupController',
          resolve: {
            items: function() {
              return {
                title: 'Information!',
                message: 'Incomes could NOT be loaded!',
                onYesCallback: null
              };
            },
          }
        });
        $scope.loading = false;
     });
  }

  $scope.retrieveIncomeList();

  // EDIT INCOME FUNCTIONALITY
  $scope.editIncome = function(income) {

    var refreshValues = function() {
       $scope.retrieveIncomeList();
    }

    $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/edit-income-popup.html',
      controller: 'EditIncomePopupController',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            income: JSON.parse(JSON.stringify(income)),
            afterEditCallback: refreshValues
          };
        },
      }
    });
  }

  // DELETE INCOME FUNCTIONALITY
  $scope.deleteIncome = function(income) {

      // Function to be executed if the user press Yes on modal window
      var deleteHTTPRequest = function() {
        // prepare delete request
        var income_id = income.id;
        var req = {
          method: 'DELETE',
          url: host_name + '/income/delete/' + income_id,
           headers: {
             'Content-Type': "application/json",
             'Authorization': $cookieStore.get('mmtlt')
           }
         }
        // make server request
        $http(req).then(
          function(response){

            $scope.retrieveIncomeList();
            $uibModal.open({
              animation: true,
              template: ModalTemplateService.getInfoTemplate(),
              controller: 'WarningPopupController',
              resolve: {
                items: function() {
                  return {
                    title: 'Information!',
                    message: 'Income successfully deleted!',
                    onYesCallback: null
                  };
                },
              }
            });
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
                    message: 'Income was NOT deleted!',
                    onYesCallback: null
                  };
                },
              }
            });
         });
       }

      $uibModal.open({
        animation: true,
        template: ModalTemplateService.getWarningTemplate(),
        controller: 'WarningPopupController',
        scope: $scope,
        size: 'lg',
        resolve: {
          items: function() {
            return {
              title: 'Warning!',
              message: 'Are you sure do you want to delete income [' + income.name + '] ?',
              onYesCallback: deleteHTTPRequest
            };
          },
        }
      });
   }

   // -------------- SORTING AREA ------------------
   $scope.sortColumn = 'creationDate';
   $scope.sortReverse = true;

   $scope.changeSortingCriteria = function(columnName) {
      $scope.sortColumn = columnName;
      $scope.sortReverse = !$scope.sortReverse;
   }

   // REDIRECT TO ADD INCOME PAGE
   $scope.addIncomeAttempt = function() {
      $location.path('/add_income');
   }
});

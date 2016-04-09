'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:IncomesHistoryCtrl
 * @description
 * # IncomesHistoryCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('IncomesHistoryCtrl', function ($scope, $rootScope, $http, $location, $cookieStore,
        $uibModal, ModalTemplateService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }
  $scope.incomes = [];

  // prepare post request
  var req = {
      method: 'GET',
      url: host_name + '/income/find_all',
      headers: {
        'Content-Type': "application/json",
        'Authorization': $cookieStore.get('mmtlt')
     }
   }
  // make server request
  $http(req).then(
    function(response){
      // SUCCESS: change the path
      $scope.incomes = angular.fromJson(response.data);
    },
    function(response){
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
   });

  // EDIT INCOME FUNCTIONALITY
  $scope.editIncome = function(index) {
    //TODO: implement edit income function
  }

  // DELETE INCOME FUNCTIONALITY
  $scope.deleteIncome = function(index) {

      // Function to be executed if the user press Yes on modal window
      var deleteHTTPRequest = function() {
        // prepare delete request
        var income_id = $scope.incomes[index].id;
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

            $scope.incomes.splice(index, 1);
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
        resolve: {
          items: function() {
            return {
              title: 'Warning!',
              message: 'Are you sure do you want to delete income [' + $scope.incomes[index].name + '] ?',
              onYesCallback: deleteHTTPRequest
            };
          },
        }
      });
   }

   // REDIRECT TO ADD INCOME PAGE
   $scope.addIncomeAttempt = function() {
      $location.path('/add_income');
   }
});

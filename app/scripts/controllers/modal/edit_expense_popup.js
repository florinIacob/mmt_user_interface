'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:EditExpensePopupController
 * @description
 * # EditExpensePopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('EditExpensePopupController', ['$scope', '$http','$cookieStore', 'CategoryService', 'DateTimeService',
                       '$uibModal', '$uibModalInstance', 'ModalTemplateService', 'host_name', 'items',
        function ($scope, $http, $cookieStore, CategoryService, DateTimeService, $uibModal, $uibModalInstance,
                  ModalTemplateService, host_name, items) {

   $scope.categories = CategoryService.getCategories();

   $scope.expense = items.expense;
   $scope.current_date_value = DateTimeService.createDateTimeString(new Date($scope.expense.creationDate));
   var old_date = $scope.expense.creationDate;
   $scope.expense.creationDate = null;

   // submit button - save the expense
   $scope.submit = function() {
       if ($scope.expense.creationDate == null) {
          $scope.expense.creationDate = new Date(old_date);
        }
       var submitted_expense = $scope.expense;

       // prepare post request
       var req = {
          method: 'POST',
          url: host_name + '/expense/update/' + submitted_expense.id,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(submitted_expense)
       }
       // make server request
       $http(req).then(
         // SUCCESS callback
         function(response){
           items.afterEditCallback();
           $uibModalInstance.dismiss('cancel');
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
                   message: 'Expense not saved!\n' + JSON.stringify(response.data),
                   onYesCallback: null
                 };
               },
             }
           });
        });
   }

   // Cancel button
   $scope.cancel = function() {
      items.afterEditCallback();
      $uibModalInstance.dismiss('cancel');
   }

   // Add a new category for the expense
   $scope.addCategory = function() {
     CategoryService.addCategory($scope.newCategory, $scope.categories);
     $scope.expense.category.name = $scope.newCategory;
     $scope.newCategory = null;
   }

}]);

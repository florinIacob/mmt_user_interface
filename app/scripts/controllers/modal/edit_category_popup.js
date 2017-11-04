'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:EditCategoryPopupController
 * @description
 * # EditCategoryPopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('EditCategoryPopupController', ['$scope', '$q','$cookieStore', 'CategoryService', 'DateTimeService',
                       '$uibModal', '$uibModalInstance', 'ModalTemplateService', 'host_name', 'items',
        function ($scope, $q, $cookieStore, CategoryService, DateTimeService, $uibModal, $uibModalInstance,
                  ModalTemplateService, host_name, items) {

   $scope.loading = false;
   $scope.defaultCurrency = items.defaultCurrency;
   $scope.category = items.category;

   $scope.isEditMode = true;
   if (!$scope.category) {
    $scope.isEditMode = false;
    $scope.newCategory = {
        name: null,
        colour:'stable',
        threshold: 0
    };
   }

   // submit button - save the category
   $scope.submit = function() {
       var submitted_category = $scope.category;

        var serverRequestArray = [];
        if ($scope.isEditMode) {
          serverRequestArray.push(CategoryService.updateCategory(submitted_category));
        } else {
          serverRequestArray.push(CategoryService.addNewCategory(submitted_category));
        }

       $scope.loading = true;
       // make server request
       $q.all(serverRequestArray).then(
         // SUCCESS callback
         function(responseArray){
           items.afterEditCallback();
           $uibModalInstance.close(serverRequestArray[0]);
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
                   message: 'Error saving category!\n' + JSON.stringify(response.data.message),
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

    // COLOURS
    $scope.colours_map = {
      light: 'white',
      stable: 'cornsilk',
      positive: 'DodgerBlue',
      calm: 'aqua',
      balanced: 'YellowGreen',
      energized: 'Gold',
      assertive: 'Crimson',
      royal: 'BlueViolet',
      dark: 'black'
    }
}]);

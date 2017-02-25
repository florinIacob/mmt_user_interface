'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:EditCategoryPopupController
 * @description
 * # EditCategoryPopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('EditCategoryPopupController', ['$scope', '$http','$cookieStore', 'CategoryService', 'DateTimeService',
                       '$uibModal', '$uibModalInstance', 'ModalTemplateService', 'host_name', 'items',
        function ($scope, $http, $cookieStore, CategoryService, DateTimeService, $uibModal, $uibModalInstance,
                  ModalTemplateService, host_name, items) {

   $scope.loading = false;
   $scope.category = items.category;

   // submit button - save the category
   $scope.submit = function() {
       var submitted_category = $scope.category;

       // prepare post request
       var req = {
          method: 'POST',
          url: host_name + '/category/update/' + submitted_category.id,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(submitted_category)
       }

       $scope.loading = true;
       // make server request
       $http(req).then(
         // SUCCESS callback
         function(response){
           items.afterEditCallback();
           $uibModalInstance.dismiss('cancel');
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
                   message: 'Category not saved!\n' + JSON.stringify(response.data),
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

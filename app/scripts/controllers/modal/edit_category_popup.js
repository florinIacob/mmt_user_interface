'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:EditCategoryPopupController
 * @description
 * # EditCategoryPopupController
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('EditCategoryPopupController', ['$scope', '$rootScope', '$http','$cookieStore', 'CategoryService', 'DateTimeService',
                       '$uibModal', '$uibModalInstance', 'ModalTemplateService', 'host_name', 'items',
        function ($scope, $rootScope, $http, $cookieStore, CategoryService, DateTimeService, $uibModal, $uibModalInstance,
                  ModalTemplateService, host_name, items) {

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
                   title: $rootScope.isEng() ? 'Information!':'Informatie!',
                   message: $rootScope.isEng() ? 'Category not saved!\n':'Categoria nu a fost salvata!\n' + JSON.stringify(response.data),
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

}]);

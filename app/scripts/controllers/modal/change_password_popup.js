'use strict';

angular.module('mmtUiApp')
  .controller('ChangePasswordController', ['$scope', '$uibModalInstance', '$http', '$uibModal', '$cookieStore', 'host_name', 'ModalTemplateService',
        function ($scope, $uibModalInstance, $http, $uibModal, $cookieStore, host_name, ModalTemplateService) {

    $scope.loading = false;

    $scope.currentP = null;
    $scope.newP = null;
    $scope.retypeP = null;
    $scope.errMessage = null;

   $scope.submit = function() {
      if ($scope.newP !== $scope.retypeP) {
        $scope.errMessage = 'Please retype the same password!'
        return;
      }

       var req = {
          method: 'POST',
          url: host_name + '/user/change_password',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify({op: $scope.currentP, np: $scope.newP})
       }

       $scope.loading = true;
       // make server request
       $http(req).then(
         function success(response){
           // SUCCESS: change the path
           $uibModal.open({
             animation: true,
             template: ModalTemplateService.getInfoTemplate(),
             controller: 'WarningPopupController',
             resolve: {
               items: function() {
                 return {
                   title: 'Information!',
                   message: 'Succesfully changed your password!',
                   onYesCallback: null
                 };
               },
             }
           });
           $uibModalInstance.dismiss('cancel');
           $scope.loading = false;
         },
         function error(response){
           var isValidString = function(string) {
              return (string!=undefined && string!=null && string!='');
           }
           var errMsg = '';
           if (isValidString(response.data.message)) {
              errMsg = ' Reason: ' + response.data.message;
           }

            $scope.loading = false;
           $scope.errMessage = 'Cannot change your password!' + errMsg;
        });

   };

   $scope.cancel = function() {
       $uibModalInstance.dismiss('cancel');
   };

}]);

'use strict';

angular.module('mmtUiApp')
  .controller('ForgotPasswordPopupController', ['$scope', '$uibModalInstance', '$http', '$uibModal', '$cookieStore', 'host_name', 'ModalTemplateService',
        function ($scope, $uibModalInstance, $http, $uibModal, $cookieStore, host_name, ModalTemplateService) {

    $scope.email = null;

   $scope.submit = function() {
      if ($scope.newP !== $scope.retypeP) {
        $scope.errMessage = 'Please retype the same password!'
        return;
      }

       var req = {
          method: 'POST',
          url: host_name + '/user/forgot_password',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify({email: $scope.email})
       }
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
                   message: 'An email for renewing password was sent at the \nspecified email address!',
                   onYesCallback: null
                 };
               },
             }
           });
           $uibModalInstance.dismiss('cancel');
         },
         function error(response){
           var isValidString = function(string) {
              return (string!=undefined && string!=null && string!='');
           }
           var errMsg = '';
           if (isValidString(response.data.message)) {
              errMsg = ' Reason: ' + response.data.message;
           }

           $scope.errMessage = 'Cannot send email for renewing password for the specified email address!' + errMsg;
        });

   };

   $scope.cancel = function() {
       $uibModalInstance.dismiss('cancel');
   };

}]);

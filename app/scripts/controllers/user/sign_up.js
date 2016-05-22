'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('SignUpCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, $uibModal, ModalTemplateService, host_name) {

  $scope.retyped_password = null;

  $scope.user = {
     id: 0,
     email: "",
     username: "",
     password: "",
     firstName: "",
     surname: "",
     birthdate: "",
     activated: ""
  }

  // submit button - save the user
  $scope.submit = function() {
      var submitted_user = $scope.user;
      var valid_attempt = true;

      if (submitted_user.password !== $scope.retyped_password) {
          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: $rootScope.isEng() ? 'Information!':'Informatie!',
                  message: $rootScope.isEng() ? "Please retype the same password!":"Te rugam retipareste aceeasi parola!",
                  onYesCallback: null
                };
              },
            }
          });
          $scope.retyped_password = null;
          $scope.user.password = null;
          return;
      }

      // prepare post request
      var req = {
         method: 'POST',
         url: host_name + '/user/add',
         headers: {
           'Content-Type': "application/json"
         },
         data: JSON.stringify(submitted_user)
      }
      // make server request
      $http(req).then(
        //success callback
        function(response){

          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: $rootScope.isEng() ? 'Information!':'Informatie!',
                  message: $rootScope.isEng() ? 'Your account was created!'
                          + '\nPlease check your mail to activate your account!'
                          + '\nAfter the activation, you can login to your account!'
                          :
                          'Contul a fost creat!'
                          + '\nTe rugam verifica email-ul pentru activarea contului!'
                          + '\nDupa activare, vei putea sa te loghezi in aplicatie!',
                  onYesCallback: null
                };
              },
            }
          });
          $location.path('/home')
        },
        // error callback
        function(response){

          if (response.data.errors) {
            var error_message = response.data.errors[0].defaultMessage;
          } else {
            var error_message = response.data.message;
          }

          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: $rootScope.isEng() ? 'Information!':'Informatie!',
                  message: $rootScope.isEng() ? 'Your account was not created! \n':'Contul NU a fost creat! \n' + error_message,
                  onYesCallback: null
                };
              },
            }
          });
       });
  }
});

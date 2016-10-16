'use strict';

angular.module('mmtUiApp')
  .controller('RenewForgotPasswordCtrl', function($scope, $location, $http, $routeParams, $uibModal, ModalTemplateService, host_name) {

			console.log(' -- RenewForgotPasswordCtrl --');
      console.log(' -- code: ' + $routeParams.code);

      $scope.loading = false;

      $scope.forgot_obj = {};
      $scope.forgot_obj.np = null;
      $scope.forgot_obj.code = $routeParams.code;

      $scope.retyped_password = null;

      $scope.submit = function() {

        if (!$scope.forgot_obj.code) {
          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Warning!',
                  message: 'The code for renewing password cannot be empty!',
                  onYesCallback: null
                };
              },
            }
          });
          return;
        }

        if ($scope.forgot_obj.np != $scope.retyped_password) {
          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Warning!',
                  message: 'Please retype the same password!',
                  onYesCallback: null
                };
              },
            }
          });
          return;
        }

        $scope.loading = true;

        // prepare post request
        var req = {
           method: 'POST',
           url: host_name + '/user/renew_forgot_password',
           headers: {
             'Content-Type': "application/json"
           },
           data: JSON.stringify($scope.forgot_obj)
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
                    title: 'Information!',
                    message: 'Your password has been renewed!',
                    onYesCallback: null
                  };
                },
              }
            });
            $scope.loading = false;
            $location.path('/login');

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
                    title: 'Problems!!',
                    message: 'Your password cannot be renewed! \n' + error_message,
                    onYesCallback: null
                  };
                },
              }
            });
            $scope.loading = false;
         });
      }

		});

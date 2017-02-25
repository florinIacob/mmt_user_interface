'use strict';

angular.module('mmtUiApp')
  .controller('ActivationCtrl', function($scope, $location, $http, $routeParams, $uibModal, ModalTemplateService, host_name) {

			console.log(' -- ActivationCtrl --');
      console.log(' -- code: ' + $routeParams.code);

      $scope.loading = true;

      $scope.code = $routeParams.code;

      $scope.activateAccount = function() {

        if (!$scope.code) {
          $uibModal.open({
            animation: true,
            templateUrl: 'views/modal/info-modal.html',
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Warning!',
                  message: 'The code for account activation cannot be empty!',
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
           method: 'GET',
           url: host_name + '/user/activation/' + $scope.code,
           headers: {
             'Content-Type': "application/json"
           }
        }
        // make server request
        $http(req).then(
          //success callback
          function(response){

            $uibModal.open({
              animation: true,
              templateUrl: 'views/modal/info-modal.html',
              controller: 'WarningPopupController',
              resolve: {
                items: function() {
                  return {
                    title: 'Information!',
                    message: 'Your account has been activated!\nYou can login to the application.',
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
              templateUrl: 'views/modal/info-modal.html',
              controller: 'WarningPopupController',
              resolve: {
                items: function() {
                  return {
                    title: 'Problems!!',
                    message: 'Your account cannot be activated! \n' + error_message,
                    onYesCallback: null
                  };
                },
              }
            });
            $scope.loading = false;
         });
      }

      $scope.activateAccount();
		});

'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('SignUpCtrl', function ($scope, $http, $location, $cookieStore, $uibModal, ModalTemplateService, CurrencyUtilFactory,
          DateTimeService, host_name) {

  $scope.loading = false;
  $scope.retyped_password = null;

  $scope.user = {
     id: 0,
     email: "",
     username: "",
     password: "",
     firstName: "",
     surname: "",
     birthdate: "",
     activated: "",
     defaultCurrency: null
  }

  $scope.availableCurrencies = CurrencyUtilFactory.getAvailableCurrencies();

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
                  title: 'Information!',
                  message: "Please retype the same password!",
                  onYesCallback: null
                };
              },
            }
          });
          $scope.retyped_password = null;
          $scope.user.password = null;
          return;
      }

      if (!submitted_user.defaultCurrency) {
          $uibModal.open({
            animation: true,
            template: ModalTemplateService.getInfoTemplate(),
            controller: 'WarningPopupController',
            resolve: {
              items: function() {
                return {
                  title: 'Information!',
                  message: "Please choose the default currency!",
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
                  title: 'Information!',
                  message: 'Your account was created!'
                          + '\nPlease check your mail to activate your account!'
                          + '\nAfter the activation, you can login to your account!',
                  onYesCallback: null
                };
              },
            }
          });
          $scope.loading = false;
          $location.path('/home');
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
                  title: 'Information!',
                  message: 'Your account was not created! \n' + error_message,
                  onYesCallback: null
                };
              },
            }
          });
          $scope.loading = false;
       });
  }

  /*---- Start DATE PICKER ----*/
  $scope.format = 'dd-MMMM-yyyy';
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.datePopup = {
    opened: false
  };
  $scope.openDatePicker = function() {
    $scope.datePopup.opened = true;
  };
  $scope.dateOptions = DateTimeService.getDateOptions();
  /*---- End DATE PICKER ----*/
});

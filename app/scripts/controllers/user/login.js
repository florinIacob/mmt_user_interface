'use strict';

angular.module('mmtUiApp')
  .controller('LoginCtrl', function($rootScope, $http, $location, $route, $cookieStore, $cookies,
      $uibModal, ModalTemplateService, host_name) {

			var self = this;

			self.tab = function(route) {
				return $route.current && route === $route.current.controller;
			};

			var authenticate = function(credentials, callback) {

				var headers = credentials ? {
					authorization : "Basic "
							+ btoa(credentials.username + ":"
									+ credentials.password)
				} : {};

				$http.get(host_name + '/user/login', {
					headers : headers
				}).success(function(data, status, headers) {
					if (data.username) {
						$rootScope.authenticated = true;
						$cookieStore.put('username', data.username);
						$cookieStore.put('mmtlt', "Basic " + btoa(credentials.username + ":" + credentials.password));
					} else {
						$rootScope.authenticated = false;
						$cookieStore.remove('mmtlt');
					}
					callback && callback($rootScope.authenticated);
				}).error(function(data, status, headers) {
					$rootScope.authenticated = false;
					callback && callback(false);
				});

			}

			authenticate();

			self.credentials = {};
			self.login = function() {
				authenticate(self.credentials, function(authenticated) {
					if (authenticated) {
						console.log("Login succeeded")
						$location.path("/");
						$rootScope.authenticated = true;
						$rootScope.username = $cookieStore.get('username');
					} else {

            $uibModal.open({
              animation: true,
              template: ModalTemplateService.getInfoTemplate(),
              controller: 'WarningPopupController',
              resolve: {
                items: function() {
                  return {
                    title: 'Information!',
                    message: 'Invalid username or password!\n'
                              + 'Please activate your account before logging in!',
                    onYesCallback: null
                  };
                },
              }
            });

						$location.path("/login");
						self.error = true;
						$rootScope.authenticated = false;
					}
				})
			};

			self.forgotPassword = function() {
			  $uibModal.open({
          animation: true,
          template: ModalTemplateService.getForgotPasswordTemplate(),
          controller: 'ForgotPasswordPopupController',
          resolve: {
            items: function() {
              return {
                title: 'Information!',
                message: '',
                onYesCallback: null
              };
            },
          }
        });
			}

		});

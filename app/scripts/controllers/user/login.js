'use strict';

angular.module('mmtUiApp')
  .controller('LoginCtrl', function($rootScope, $http, $location, $route, $cookieStore, $cookies,
      $uibModal, ModalTemplateService, host_name, InitService) {

			var self = this;
      self.loading = false;

			self.tab = function(route) {
				return $route.current && route === $route.current.controller;
			};

      /**
       * Authenticate User
       */
			var authenticate = function(credentials, callback) {

        self.loading = true;

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
					self.loading = false;
				}).error(function(data, status, headers) {
					$rootScope.authenticated = false;
					callback && callback(false);
					self.loading = false;
				});

			}

			self.credentials = {};
			if ($rootScope.username) {
			  self.credentials.username = $rootScope.username;
      }
			self.login = function() {
				authenticate(self.credentials, function(authenticated) {
					if (authenticated) {
						console.log("Login succeeded 2.0");

						if ($rootScope.lastAttemptPath) {
              $location.path($rootScope.lastAttemptPath);
            } else {
              $location.path("/expenses_history");
            }
						$rootScope.authenticated = true;
						$rootScope.username = $cookieStore.get('username');
						InitService.init();
					} else {

            $uibModal.open({
              animation: true,
              templateUrl: 'views/modal/info-modal.html',
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
          templateUrl: 'views/modal/forgot-password-modal.html',
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

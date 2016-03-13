angular.module('mmtUiApp')
  .controller('LoginCtrl', function($rootScope, $http, $location, $route, $cookieStore, host_name, $cookies) {

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
						self.error = false;
						$rootScope.authenticated = true;
					} else {
						console.log("Login failed")
						$location.path("/login");
						self.error = true;
						$rootScope.authenticated = false;
					}
				})
			};

			self.logout = function() {
				$http.post('logout', {}).finally(function() {
					$rootScope.authenticated = false;
					$location.path("/");
				});
			}

		});

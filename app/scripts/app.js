'use strict';

/**
 * @ngdoc overview
 * @name mmtUiApp
 * @description
 * # mmtUiApp
 *
 * Main module of the application.
 */
var app = angular.module('mmtUiApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch'
	])
	.run(function($rootScope, $cookieStore) {
      $rootScope.authenticated = $cookieStore.get('mmtlt') !== undefined;
  })
	.config(function ($routeProvider, $httpProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				controllerAs: 'main'
			})
			.when('/about', {
				templateUrl: 'views/about.html',
				controller: 'AboutCtrl',
				controllerAs: 'about'
			})
			.when('/sign_up', {
				templateUrl: 'views/sign_up.html',
				controller: 'SignUpCtrl',
				controllerAs: 'sign_up'
			})
			.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'controller'
      	})
			.when('/add_expense', {
				templateUrl: 'views/add_expense.html',
				controller: 'AddExpenseCtrl',
				controllerAs: 'add_expense'
			})
			.when('/add_income', {
        templateUrl: 'views/add_income.html',
        controller: 'AddIncomeCtrl',
        controllerAs: 'add_income'
      })
			.otherwise({
				redirectTo: '/'
			});

			$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	});

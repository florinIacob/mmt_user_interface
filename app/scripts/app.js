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
		'ngTouch',
		'ui.bootstrap',
		'chart.js'
	])
	.run(function($rootScope, $cookieStore) {
      $rootScope.authenticated = $cookieStore.get('mmtlt') !== undefined;
      $rootScope.username = $cookieStore.get('username');
      $rootScope.LANGUAGE = 'ENG';
      $rootScope.FLAG = 'UK-Flag.png';

      $rootScope.isEng = function() {
        if ($rootScope.LANGUAGE === 'ENG') {
          return true;
        } else {
          return false;
        }
      }

      $rootScope.changeLanguage = function(language) {
        $rootScope.LANGUAGE = language;
        if ($rootScope.LANGUAGE === 'ENG') {
          $rootScope.FLAG = 'UK-Flag.png';
        } else {
          $rootScope.FLAG = 'romania-flag.gif';
        }
      }
  })
	.config(function ($routeProvider, $httpProvider, ChartJsProvider) {
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
				templateUrl: 'views/user/sign_up.html',
				controller: 'SignUpCtrl',
				controllerAs: 'sign_up'
			})
			.when('/login', {
        templateUrl: 'views/user/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'controller'
      })
      .when('/logout', {
        templateUrl: 'views/user/logout.html',
        controller: 'LogoutCtrl',
        controllerAs: 'controller'
      })
      .when('/profile', {
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'controller'
      })
			.when('/add_expense', {
				templateUrl: 'views/expense/add_expense.html',
				controller: 'AddExpenseCtrl',
				controllerAs: 'add_expense'
			})
			.when('/expenses_history', {
        templateUrl: 'views/expense/expenses_history.html',
        controller: 'ExpensesHistoryCtrl',
        controllerAs: 'expenses_history'
      })
      .when('/expenses_chart', {
        templateUrl: 'views/expense/expenses_chart.html',
        controller: 'ExpensesChartCtrl',
        controllerAs: 'expenses_chart'
      })
      .when('/expense_categories', {
        templateUrl: 'views/expense/expense_categories.html',
        controller: 'ExpenseCategoriesCtrl',
        controllerAs: 'expense_categories'
      })
			.when('/add_income', {
        templateUrl: 'views/income/add_income.html',
        controller: 'AddIncomeCtrl',
        controllerAs: 'add_income'
      })
      .when('/incomes_history', {
        templateUrl: 'views/income/incomes_history.html',
        controller: 'IncomesHistoryCtrl',
        controllerAs: 'incomes_history'
      })
      .when('/incomes_chart', {
        templateUrl: 'views/income/incomes_chart.html',
        controller: 'IncomesChartCtrl',
        controllerAs: 'incomes_chart'
      })
			.otherwise({
				redirectTo: '/'
			});

			$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

      ChartJsProvider.setOptions({ colors : [ '#46BFBD', '#803690', '#4D5360', '#00ADF9', '#DCDCDC', '#FDB45C', '#949FB1'] });
	});

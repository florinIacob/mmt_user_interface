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
		'chart.js',
		'angularjs-dropdown-multiselect',
		'angular-stripe'
	])
	.run(function($rootScope, $http, $cookieStore, $window, host_name, InitService) {
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

      Date.prototype.formatDate = function(separator) {
        if (!separator) {
          separator = "-";
        }
        return this.getDate() + " " + extractMonthAsString(this.getMonth(), false) + " " + this.getFullYear();
      }

      // TODO: line to be removed when the HTTPS certificate is ready
      $http.get(host_name).then(
          function success(response) {
              console.warn(" - Server contact attempt SUCCESS!");
          }, function error(response) {
              $window.open(host_name, "_self");
              console.error(" - Server contact attempt ERROR: " + JSON.stringify(response));
          });

      InitService.init();

  })
	.config(function ($routeProvider, $httpProvider, ChartJsProvider, stripeProvider) {
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
      .when('/privacypolicy.htm', {
        templateUrl: 'views/user/privacypolicy.htm',
        controller: ['$log', function($log) {
                $log.log('Privacy policy route!');
        }],
        controllerAs: 'controller'
      })
			.when('/add_expenses', {
				templateUrl: 'views/expense/add_expenses.html',
				controller: 'AddExpensesCtrl',
				controllerAs: 'add_expenses'
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
			.when('/add_incomes', {
        templateUrl: 'views/income/add_incomes.html',
        controller: 'AddIncomesCtrl',
        controllerAs: 'add_incomes'
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
      .when('/add_loan/:loan?/:counterparty?', {
        templateUrl: 'views/loans/add_loan.html',
        controller: 'AddLoanCtrl',
        controllerAs: 'add_loan'
      })
      .when('/counterparty_list', {
        templateUrl: 'views/loans/counterparty_list.html',
        controller: 'CounterpartyListCtrl',
        controllerAs: 'counterparty_list'
      })
      .when('/loan_list/:counterparty?/:counterpartyName?', {
        templateUrl: 'views/loans/loan_list.html',
        controller: 'LoanListCtrl',
        controllerAs: 'loan_list'
      })
      .when('/user/renew_forgot_password/:code', {
        templateUrl: 'views/user/renew_forgot_password.html',
        controller: 'RenewForgotPasswordCtrl',
        controllerAs: 'renew_forgot_password'
      })
      .when('/user/activation/:code', {
        templateUrl: 'views/user/activation.html',
        controller: 'ActivationCtrl',
        controllerAs: 'activation'
      })
      .when('/payment', {
        templateUrl: 'views/user/payment.html',
        controller: 'PaymentCtrl',
        controllerAs: 'payment'
      })
      .when('/notifications', {
        templateUrl: 'views/notifications/notification_list.html',
        controller: 'NotificationListCtrl',
        controllerAs: 'notification_list'
      })
			.otherwise({
				redirectTo: '/'
			});

			$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

      ChartJsProvider.setOptions({ colors : [ '#46BFBD', '#803690', '#4D5360', '#00ADF9', '#DCDCDC', '#FDB45C', '#949FB1'] });

      stripeProvider.setPublishableKey('pk_test_dXg1ag4chbeaGcGtpHyt1BkD');
	});

'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('AboutCtrl', function ($scope, $http) {
    
	$scope.restMessage = "Mock message!!"; 
		
	$http({
		method: 'GET',
		url: 'http://localhost:8080/greeting'	//'http://www.w3schools.com/angular/customers.php'
	}).then(function successCallback(response) {
		//$scope.names = response.data.records;
		$scope.restMessage = 'SUCCESS';
	}, function errorCallback(response) {
		$scope.restMessage = 'ERROR ' + response.status;
	});
  });

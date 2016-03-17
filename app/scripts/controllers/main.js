'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('MainCtrl', function ($rootScope, $scope, $cookieStore) {
    $scope.username = $cookieStore.get('username');
    $rootScope.username = $cookieStore.get('username');
  });

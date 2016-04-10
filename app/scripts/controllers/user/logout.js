'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('LogoutCtrl', function ($rootScope, $http, $location, $cookieStore, host_name) {
    // prepare post request
    var req = {
       method: 'GET',
       url: host_name + '/user/logout',
       headers: {
         'Content-Type': "application/json",
         'Authorization': $cookieStore.get('mmtlt')
       }
    }
    // make server request
    $http(req).then(
      function(response){
        // SUCCESS: change the path
        $rootScope.authenticated = false;
        $rootScope.username = undefined;
        $cookieStore.remove('mmtlt');
        $cookieStore.remove('username');
        $location.path('/');
      },
      function(response){
        $location.path('/login');
     });
});

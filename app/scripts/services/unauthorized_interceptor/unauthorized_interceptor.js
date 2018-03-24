app.factory('unauthorizedInterceptor', ['$q', '$location', '$rootScope', function($q, $location, $rootScope) {

  var unauthorizedInterceptor = {
    'responseError': function(rejection) {
      // do something on error
      if (rejection && rejection.status === 401) {
        var lastAttemptPath = $location.path();
        if (lastAttemptPath.indexOf("login") < 0 && lastAttemptPath !== '/') {
          $rootScope.lastAttemptPath = lastAttemptPath;
        }
        $location.path('/login');
      }
      return $q.reject(rejection);
    }
};

  return unauthorizedInterceptor;
}]);

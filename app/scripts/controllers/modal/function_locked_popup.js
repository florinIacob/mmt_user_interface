'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:FunctionLockedPopupController
 * @description
 * # FunctionLockedPopupController
 * Controller of the mmtUiApp
 */
app.controller('FunctionLockedPopupController', ['$scope', '$uibModalInstance', 'items', '$location',
        function ($scope, $uibModalInstance, items, $location) {

    $scope.items = items;

    $scope.cancel = function() {
       $uibModalInstance.dismiss('cancel');
    };

    $scope.goToHomePage = function() {
        $location.path('/');
        $uibModalInstance.dismiss('cancel');
    };

    $scope.goToPayment = function() {
        $location.path('/payment');
        $uibModalInstance.dismiss('cancel');
    };

}]);


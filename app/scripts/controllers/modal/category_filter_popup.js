'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:CategoryFilterPopupController
 * @description
 * # CategoryFilterPopupController
 * Controller of the mmtUiApp
 */
app.controller('CategoryFilterPopupController', ['$scope', '$uibModalInstance', 'items',
        function ($scope, $uibModalInstance, items) {

    $scope.items = items;

    $scope.selected_category = '< ALL CATEGORIES >';

    $scope.filter = function() {
       items.onFilterCallback($scope.selected_category);
       $uibModalInstance.dismiss('cancel');
    };

    $scope.cancel = function() {
       $uibModalInstance.dismiss('cancel');
    };

    $scope.categories = extractCategoryNames(items.expenses);
}]);

// Function that extracts all categories from the received expenses list
var extractCategoryNames = function(expenses) {
  var categoryNames = [];
  var i;
  for (i = 0; i < expenses.length; i++) {
    categoryNames.push(expenses[i].category.name);
  }
  categoryNames.push('< ALL CATEGORIES >');
  return categoryNames;
}


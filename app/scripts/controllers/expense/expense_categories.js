
/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpenseCategoriesCtrl
 * @description
 * # ExpenseCategoriesCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpenseCategoriesCtrl', function ($scope, $rootScope, $http, $location, $cookieStore, CategoryService, DateTimeService,
       $route, $uibModal, ModalTemplateService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.newCategory = {
      name: undefined,
      colour:'stable'
  };
  $scope.loading = true;
  $scope.categories = [];

  $scope.categories = CategoryService.getCategories().then(
    function successCallback(response) {
        $scope.categories = response.data;
        $scope.loading = false;
     }, function errorCallback(response) {
       openInfoPopup('WARNING', 'Cannot access categories!');
       $scope.loading = false;
     });

  $scope.addCategory = function() {
    CategoryService.addCategory($scope.newCategory, $scope.categories);
    $scope.newCategory = {
        name: undefined,
        colour:'stable'
    };
  }

  $scope.deleteCategory = function(category) {

    function _onDeleteCallback() {
        CategoryService.deleteCategory(category, $scope.categories);
    }

    $uibModal.open({
        animation: true,
        templateUrl: 'views/modal/warning-modal.html',
        controller: 'WarningPopupController',
        scope: $scope,
        size: 'lg',
        resolve: {
          items: function() {
            return {
              title: 'Warning!',
              message: 'Besides this category, all expenses having the category [' + category.name + '] will be deleted. Proceed ?',
              onYesCallback: _onDeleteCallback
            };
          },
        }
      });

  }

  $scope.editCategory = function(category) {
    var refreshValues = function() {
       $route.reload();
    }

    $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/edit-category-modal.html',
      controller: 'EditCategoryPopupController',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            category: JSON.parse(JSON.stringify(category)),
            afterEditCallback: refreshValues
          };
        },
      }
    });
  }

  // COLOURS
  $scope.colours_map = {
      light: 'white',
      stable: 'cornsilk',
      positive: 'DodgerBlue',
      calm: 'aqua',
      balanced: 'YellowGreen',
      energized: 'Gold',
      assertive: 'Crimson',
      royal: 'BlueViolet',
      dark: 'black'
  }
});

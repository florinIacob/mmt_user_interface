
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
    CategoryService.deleteCategory(category, $scope.categories);
  }

  $scope.editCategory = function(category) {
    var refreshValues = function() {
       $route.reload();
    }

    $uibModal.open({
      animation: true,
      template: ModalTemplateService.getEditCategoryTemplate(),
      controller: 'EditCategoryPopupController',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            category: category,
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

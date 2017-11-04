
/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpenseCategoriesCtrl
 * @description
 * # ExpenseCategoriesCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpenseCategoriesCtrl', function ($scope, $rootScope, $q, $location, $cookieStore, CategoryService, DateTimeService,
       $route, $uibModal, ModalTemplateService, host_name, CurrencyUtilFactory) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  /**
   * Initialize data for Controller
   */
  $scope.initData = function() {
    var serverRequestArray = [];
    serverRequestArray.push(CurrencyUtilFactory.getDefaultCurrency());
    serverRequestArray.push(CategoryService.getCategories());

    $scope.loading = true;
    $scope.categories = [];

    $q.all(serverRequestArray).then(
      function successCallback(responseArray) {
          $scope.defaultCurrency = responseArray[0].data.value;
          $scope.categories = responseArray[1].data;
          $scope.loading = false;
       }, function errorCallback(response) {
         openInfoPopup('WARNING', 'Cannot access categories!');
         $scope.loading = false;
       });
  };

  $scope.initData();

  /**
   * Delete a category
   */
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
  };

  /**
   * Add / Update a category
   */
  $scope.saveCategory = function(category) {
    var refreshValues = function() {
       $route.reload();
    };

    $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/edit-category-modal.html',
      controller: 'EditCategoryPopupController',
      backdrop: 'static',
      size: 'lg',
      resolve: {
        items: function() {
          return {
            defaultCurrency: $scope.defaultCurrency,
            category: category ? JSON.parse(JSON.stringify(category)) : null,
            afterEditCallback: refreshValues
          };
        }
      }
    });
  };

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

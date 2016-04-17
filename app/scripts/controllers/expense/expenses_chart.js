'use strict';

/**
 * @ngdoc function
 * @name mmtUiApp.controller:ExpensesChartCtrl
 * @description
 * # ExpensesChartCtrl
 * Controller of the mmtUiApp
 */
angular.module('mmtUiApp')
  .controller('ExpensesChartCtrl', function ($scope, $rootScope, $http, $location, $route, $cookieStore,
        CategoryService, $uibModal, ModalTemplateService, host_name) {

  if (!$rootScope.authenticated) {
    $location.path('/login');
  }

  $scope.graphics = ["LINEAR", "BAR", "PIE", "DOUGHNUT", "POLAR"];
  $scope.graphic_type = "LINEAR";

  // LINEAR graphic
  $scope.labelsLinear = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.seriesLinear = [' A ', ' B ', ' C '];
  $scope.dataLinear = [
    [65, 59, 80, 81, 56, 55, 40],
    [23, 60, 80, 81, 46, 13, 12],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  // BAR graphic
  $scope.labelsBar = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.seriesBar = [' A ', ' B ', ' C '];
  $scope.dataBar = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
    [38, 48, 65, 34, 22, 27, 95]
  ];

  // DOUGHNUT graphic
  $scope.labelsDoughnut = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.dataDoughnut = [300, 500, 100];

  // PIE graphic
  $scope.labelsPie = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.dataPie = [300, 500, 100];

  // POLAR graphic
  $scope.labelsPolar = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
  $scope.dataPolar = [300, 500, 100, 40, 120];
});

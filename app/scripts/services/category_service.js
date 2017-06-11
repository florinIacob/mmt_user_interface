'use strict';

app.factory('CategoryService', function($http, $q, $cookieStore, $route, $uibModal, ModalTemplateService, host_name) {
  var service = {};

  // GET CATEGORY NAMES
  service.getCategoryNames = function() {
    var categories = [];
    $http({
    		method: 'GET',
    		url: host_name + '/category/find_all',
    		headers: {
          'Authorization': $cookieStore.get('mmtlt')
        },
    	}).then(function successCallback(response) {
    		extractNames(response.data, categories);
    	}, function errorCallback(response) {
    		categories.push('ERROR');
    	});
    return categories;
  }

  // GET CATEGORIES
  service.getCategories = function() {
    return $http({
        method: 'GET',
        url: host_name + '/category/find_all',
        headers: {
          'Authorization': $cookieStore.get('mmtlt')
        },
      });
  }

  // GET CATEGORIES AS PROMISE
  service.getCategoriesAsPromise = function() {
    var deferred = $q.defer();
    $http({
        method: 'GET',
        url: host_name + '/category/find_all',
        headers: {
          'Authorization': $cookieStore.get('mmtlt')
        },
      }).then(function successCallback(response) {
        deferred.resolve(angular.fromJson(response.data));
      }, function errorCallback(response) {
        openInfoPopup('WARNING', 'Cannot access categories!');
      });
    return deferred.promise;
  }


  // ADD A CATEGORY NAME
  service.addCategoryName = function(categoryName, categoriesArray) {

    if (categoryName == null || categoryName == '') {
      openInfoPopup('WARNING', "The name of the category should not be empty!");
      return;
    }

    categoriesArray.push(categoryName);
    var category_object = {
      id: 0,
      name: categoryName,
      user: null
    }
    var req = {
      method: 'POST',
      url: host_name + '/category/add',
      headers: {
        'Content-Type': "application/json",
        'Authorization': $cookieStore.get('mmtlt')
      },
      data: JSON.stringify(category_object)
    }
    // make server request
    $http(req).then(
      function(){
      },
      function(response){
          openInfoPopup('WARNING', 'Cannot create category\n' + response.data.message + '!');
      });
  }

  // ADD A CATEGORY
  service.addCategory = function(category, categoriesArray) {

    if (category.name == null || category.name == '') {
      openInfoPopup('WARNING', "The name of the category should not be empty!");
      return;
    }

    var req = {
      method: 'POST',
      url: host_name + '/category/add',
      headers: {
        'Content-Type': "application/json",
        'Authorization': $cookieStore.get('mmtlt')
      },
      data: JSON.stringify(category)
    }
    // make server request
    $http(req).then(
      function(response){
        categoriesArray.push(response.data);
        openInfoPopup('INFO', "Category successfully added!");
      },
      function(response){
        openInfoPopup('WARNING', 'Cannot create category\n' + response.data.message + '!');
      });
  }

  // DELETE A CATEGORY
  service.deleteCategory = function(category, categoriesArray) {
    var req = {
      method: 'DELETE',
      url: host_name + '/category/delete/' + category.id,
      headers: {
        'Authorization': $cookieStore.get('mmtlt')
      },
    }
    // make server request
    $http(req).then(
      function(){
        openInfoPopup('INFO', "Category successfully deleted!");
        $route.reload();
      },
      function(response){
        openInfoPopup('WARNING', 'Cannot delete category\n' + response.data.message + '!');
      });
  }

    /**
    * Function used for adding a new category
    */
    service.addNewCategory = function(categoryEntity) {
      var deferred = $q.defer();

      $http({
          method: 'POST',
          url: host_name + '/category/add',
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(categoryEntity)
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- POST ERROR: ' + host_name + '/category/add WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

    /**
    * Function used for updating a Category
    */
    service.updateCategory = function(categoryEntity) {
      var deferred = $q.defer();

      $http({
          method: 'POST',
          url: host_name + '/category/update/' + categoryEntity.id,
          headers: {
            'Content-Type': "application/json",
            'Authorization': $cookieStore.get('mmtlt')
          },
          data: JSON.stringify(categoryEntity)
      }).then(
        function success(response) {
          deferred.resolve(response.data);
        },
        function error(response) {
          console.error(' --- PUT ERROR: ' + host_name + '/category/update/' + categoryEntity.id + ' WITH ERROR: +++' + JSON.stringify(response.data) + '+++');
          deferred.reject(response);
        }
      );
      return deferred.promise;
    };

  // Extracts an array of strings that contains the category names from the received category array
  var extractNames = function(categoriesArray, categoryNames) {
    var i;
    for (i = 0; i < categoriesArray.length; i++) {
      categoryNames.push(categoriesArray[i].name);
    }
  }

  // function used to print a message to the user
  var openInfoPopup = function(title, message) {
    $uibModal.open({
      animation: true,
      templateUrl: 'views/modal/info-modal.html',
      controller: 'WarningPopupController',
      resolve: {
        items: function() {
          return {
            title: title,
            message: message,
            onYesCallback: null
          };
        },
      }
    });
  }

  return service;
});

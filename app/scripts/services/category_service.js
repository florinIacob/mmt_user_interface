app.factory('CategoryService', function($http, $rootScope, $q, $cookieStore, $route, $uibModal, ModalTemplateService, host_name) {
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
    var categories = [];
    $http({
        method: 'GET',
        url: host_name + '/category/find_all',
        headers: {
          'Authorization': $cookieStore.get('mmtlt')
        },
      }).then(function successCallback(response) {
        for(var i = 0, len = response.data.length; i < len; ++i)
           categories[i] = response.data[i];
      }, function errorCallback(response) {
        openInfoPopup('WARNING', 'Cannot access categories!');
      });
    return categories;
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
      openInfoPopup('WARNING', $rootScope.isEng() ? "The name of the category should not be empty!":"Numele categoriei trebuie completat!");
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
      openInfoPopup('WARNING', $rootScope.isEng() ? "The name of the category should not be empty!":"Numele categoriei trebuie completat!");
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
        openInfoPopup('INFO', $rootScope.isEng() ? "Category successfully added!":"Categoria a fost adaugata cu succes!");
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
        openInfoPopup('INFO', $rootScope.isEng() ? "Category successfully deleted!":"Categoria a fost stearsa!");
        $route.reload();
      },
      function(response){
        openInfoPopup('WARNING', 'Cannot delete category\n' + response.data.message + '!');
      });
  }

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
      template: ModalTemplateService.getInfoTemplate(),
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

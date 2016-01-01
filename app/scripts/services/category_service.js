app.factory('categoryService', function($http) {
  var service = {};

  // GET CATEGORIES
  service.getCategories = function() {
    var categories = [];
    $http({
    		method: 'GET',
    		url: 'http://localhost:8080/category/find_all'
    	}).then(function successCallback(response) {
    		extractNames(response.data, categories);
    	}, function errorCallback(response) {
    		categories.push('ERROR');
    	});
    return categories;
  }

  // ADD A CATEGORY
  service.addCategory = function(categoryName, categoriesArray) {
    categoriesArray.push(categoryName);
    var category_object = {
      id: 0,
      name: categoryName,
      user: null
    }
    var req = {
      method: 'POST',
      url: 'http://localhost:8080/category/add',
      headers: {
        'Content-Type': "application/json"
      },
      data: JSON.stringify(category_object)
    }
    // make server request
    $http(req).then(
      function(){
      },
      function(response){
      });
  }

  var extractNames = function(categoriesArray, categoryNames) {
    var i;
    for (i = 0; i < categoriesArray.length; i++) {
      categoryNames.push(categoriesArray[i].name);
    }
  }

  return service;
});

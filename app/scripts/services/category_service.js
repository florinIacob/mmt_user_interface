app.factory('categoryService', function($http, $cookieStore, host_name) {
  var service = {};

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

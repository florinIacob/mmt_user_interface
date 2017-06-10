'use strict';

app.factory('AlertService',
  ['$http', '$uibModal', 'host_name',
  function($http, $uibModal, host_name) {

    var service = {};

    /**
    * Display simple alert to interface with the specified details
    */
    service.displaySimpleAlert = function(title, message) {
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
    };

    return service;
}]);

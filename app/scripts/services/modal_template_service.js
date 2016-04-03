app.factory('modalTemplateService', function() {
  var service = {};

  // GET WARNING POPUP TEMPLATE
  service.getWarningTemplate = function() {
    const warningTemplate = `
      <div class="source-list-modal">
          <div class="modal-header">
              <h3 class="modal-title">
                  {{items.title}}
              </h3>
              <br>
              <p>{{items.message}}</p>
              <hr>
              <div class="controls">
                  <button style="left-margin:3px;" class="btn btn-primary" type="button" ng-click="yes()">Yes</button>
                  <button class="btn btn-primary" type="button" ng-click="no()">No</button>
              </div>
          </div>
      </div>
    `;
    return warningTemplate;
  }

  return service;
});

'use strict';

app.factory('ModalTemplateService', function() {
  var service = {};

  // GET WARNING POPUP TEMPLATE
  service.getWarningTemplate = function() {
    const warningTemplate = `
      <div class="source-list-modal">
          <div class="modal-header">
              <h3 class="modal-title">
                  {{items.title}}
              </h3>
              <hr>
              <div class="modal-message-div">{{items.message}}</div>
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

  // GET INFO POPUP TEMPLATE
  service.getInfoTemplate = function() {
    const warningTemplate = `
      <div class="source-list-modal">
          <div class="modal-header">
              <h3 class="modal-title">
                  {{items.title}}
              </h3>
              <hr>
              <div class="modal-message-div">{{items.message}}</div>
              <hr>
              <div class="controls">
                  <button class="btn btn-primary" type="button" ng-click="no()">OK</button>
              </div>
          </div>
      </div>
    `;
    return warningTemplate;
  }

  /**
   * Return modal window template for change password
   */
  service.getChangePasswordTemplate = function() {
    const warningTemplate = `
      <div class="source-list-modal">
          <div class="modal-header">
              <h3 class="modal-title">
                  Change current password
              </h3>
              <hr>
              <form class="form-horizontal" role="form" ng-submit="submit()"
                  style="height:100%;background-color:#eaeae1;padding:10px;" ng-show="loading == false">
                <div class="form-group">
                  <label class="control-label col-sm-4" for="name">Current password:</label>
                  <div class="col-sm-7">
                    <input type="password" class="form-control" id="current_pass" placeholder="Type current password ..."
                      ng-model="currentP" required >
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-4" for="name">New password:</label>
                  <div class="col-sm-7">
                    <input type="password" class="form-control" id="current_pass" placeholder="Type new password ..."
                      ng-model="newP" bs-tooltip title="Password should contain at least 8 characters" required >
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-4" for="name">Retype password:</label>
                  <div class="col-sm-7">
                    <input type="password" class="form-control" id="current_pass" placeholder="Retype new password ..."
                      ng-model="retypeP" bs-tooltip title="Password should contain at least 8 characters" required >
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-11" style='color:red;' for="name" ng-show='errMessage != null'>{{errMessage}}</label>
                </div>
                <br/>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-4">
                    <button type="submit" class="btn btn-success submit-btn">
                      <span class="glyphicon glyphicon-pencil"></span> Change
                    </button>
                  </div>
                  <div class="col-sm-5">
                    <button type="button" ng-click="cancel()" class="btn btn-danger submit-btn">
                      <span class="glyphicon glyphicon-remove"></span> Cancel
                    </button>
                  </div>
                </div>
              </form>
              <loading-page width="150px" message="Processing ..." ng-show="loading == true"></loading-page>
          </div>
      </div>
    `;
    return warningTemplate;
  }

  /**
   * Return modal window template for change forgot password
   */
  service.getForgotPasswordTemplate = function() {
    const warningTemplate = `
      <div class="source-list-modal">
          <div class="modal-header">
              <h3 class="modal-title">
                  Forgot password window
              </h3>
              <hr>
              <form ng-show="loading == false" class="form-horizontal" role="form" ng-submit="submit()" style="height:100%;background-color:#eaeae1;padding:10px;">
                <br/>
                <div class="form-group">
                  <label class="col-sm-11" for="name" style="align:center;">Enter the email address used to register in application: </label>
                </div>
                <div class="form-group">
                  <div class="col-sm-11">
                    <input type="text" class="form-control" id="current_pass" placeholder="Type your email address ..."
                      ng-model="email" required >
                  </div>
                </div>
                <div class="form-group">
                  <label class="control-label col-sm-11" style='color:red;' for="name" ng-show='errMessage != null'>{{errMessage}}</label>
                </div>
                <br/>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-4">
                    <button type="submit" class="btn btn-success submit-btn">
                      <span class="glyphicon glyphicon-envelope"></span> Submit
                    </button>
                  </div>
                  <div class="col-sm-5">
                    <button type="button" ng-click="cancel()" class="btn btn-danger submit-btn">
                      <span class="glyphicon glyphicon-remove"></span> Cancel
                    </button>
                  </div>
                </div>
              </form>
              <loading-page width="150px" message="Processing ..." ng-show="loading == true"></loading-page>
          </div>
      </div>
    `;
    return warningTemplate;
  }

  // GET CATEGORY FILTER POPUP TEMPLATE
  service.getCategoryFilterTemplate = function() {
    const warningTemplate = `
      <div class="source-list-modal">
          <div class="modal-header">
              <h3 class="modal-title">
                  {{items.title}}
              </h3>
              <hr>
              <pre style="font-size:18px;">{{items.message}}</pre>
              <select type="date" class="form-control" id="category" placeholder="Category" ng-model="selected_category" required>
                <option ng-repeat="category in categories | unique"
                  value="{{category}}">{{category}}</option>
              </select>
              <hr>
              <div class="controls">
                  <button style="left-margin:3px;" class="btn btn-primary" type="button" ng-click="filter()">Filter</button>
                  <button class="btn btn-primary" type="button" ng-click="cancel()">Cancel</button>
              </div>
          </div>
      </div>
    `;
    return warningTemplate;
  }

  // EDIT CATEGORY POPUP TEMPLATE
  service.getEditCategoryTemplate = function() {
    const editCategoryTemplate = `
      <div class="source-list-modal" style="height:100%;background-color:#eaeae1;">
        <div class="container sign-up-container">
          <h2 style="text-align:center;"><img src="images/expense_categories.svg"> EDIT CATEGORY</h2>
          <form class="form-horizontal" role="form" ng-submit="submit()" ng-show="loading == false">

          <br>

            <div class="form-group">
              <label class="control-label col-sm-1" for="date">Colour:</label>
              <div class="col-sm-3">
                <select class="form-control" ng-model="category.colour" ng-style="{'background-color': colours_map[category.colour]}">
                  <option selected style="background-color: white" class="light" value="light">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: cornsilk" class="stable" value="stable">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: DodgerBlue " class="positive" value="positive">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: aqua" class="calm" value="calm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: YellowGreen" class="balanced" value="balanced">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: Gold" class="energized" value="energized">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: Crimson " class="assertive" value="assertive">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: BlueViolet " class="royal" value="royal">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                  <option style="background-color: black" class="dark" value="dark">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
                </select>
              </div>
              <div class="col-sm-3">
                <input type="text" class="form-control" placeholder="New category name" ng-model="category.name">
              </div>
              <div class="col-sm-2">
                <button type="button" class="btn btn-success submit-btn" ng-click="submit()">
                  <span class="glyphicon glyphicon-pencil"></span> Save
                </button>
              </div>
              <div class="col-sm-2">
                <button type="button" class="btn btn-danger submit-btn" ng-click="cancel()">
                  <span class="glyphicon glyphicon-remove"></span> Cancel
                </button>
              </div>
            </div>
          </label>
          <br>
          </form>
          <loading-page width="150px" message="Processing ..." ng-show="loading == true"></loading-page>
        </div>
      </div>
    `;
    return editCategoryTemplate;
  }

  return service;
});

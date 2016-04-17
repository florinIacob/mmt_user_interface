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
              <pre style="font-size:18px;">{{items.message}}</pre>
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
              <pre style="font-size:18px;">{{items.message}}</pre>
              <hr>
              <div class="controls">
                  <button class="btn btn-primary" type="button" ng-click="no()">OK</button>
              </div>
          </div>
      </div>
    `;
    return warningTemplate;
  }

  // EDIT EXPENSE POPUP TEMPLATE
  service.getEditExpenseTemplate = function() {
    const editExpenseTemplate = `
      <div class="source-list-modal" style="height:100%;background-color:#eaeae1;">
        <h2 style="text-align:center;"><img src="images/add_expense.png"> EDIT EXPENSE</h2>
        <form class="form-horizontal" role="form" ng-submit="submit()">
          <div class="form-group">
            <label class="control-label col-sm-2" for="name">Name:</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="name" placeholder="Expense name" ng-model="expense.name" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="date">Category:</label>
            <div class="col-sm-4">
              <select type="date" class="form-control" id="category" placeholder="Category" ng-model="expense.category.name" required>
                <option ng-repeat="category in categories" value="{{category}}" required>{{category}}</option>
              </select>
            </div>
            <div class="col-sm-3">
              <input type="text" class="form-control" placeholder="New category" ng-model="newCategory">
            </div>
            <div class="col-sm-2">
              <input type="button" class="form-control" placeholder="Add new category" value="Add" ng-click="addCategory()">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="description">Description:</label>
            <div class="col-sm-9">
              <textarea type="text" rows="5"  class="form-control" id="description" placeholder="Description ..." ng-model="expense.description"/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="amount">Amount:</label>
            <div class="col-sm-9">
              <input type="number" step="any" class="form-control" id="amount" placeholder="Expense amount" ng-model="expense.amount" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="date">Creation date:</label>
            <div class="col-sm-9">
              <input type="datetime-local" value="{{current_date_value}}" class="form-control" id="date" placeholder="date"
                     ng-model="expense.creationDate" required >
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-2">
              <button type="submit" class="btn btn-default submit-btn">Save</button>
            </div>
            <div class="col-sm-7">
              <button type="button" ng-click="cancel()" class="btn btn-default submit-btn">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    `;
    return editExpenseTemplate;
  }

    // EDIT INCOME POPUP TEMPLATE
    service.getEditIncomeTemplate = function() {
    const editIncomeTemplate = `
      <div class="source-list-modal" style="height:100%;background-color:#eaeae1;">
        <h2 style="text-align:center;"><img src="images/add_income.png"> EDIT INCOME</h2>
        <form class="form-horizontal" role="form" ng-submit="submit()">
          <div class="form-group">
            <label class="control-label col-sm-2" for="name">Name:</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="name" placeholder="Income name" ng-model="income.name" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="description">Description:</label>
            <div class="col-sm-9">
              <textarea type="text" rows="5"  class="form-control" id="description" placeholder="Description ..." ng-model="income.description"/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="amount">Amount:</label>
            <div class="col-sm-9">
              <input type="number" step="any" class="form-control" id="amount" placeholder="Income amount" ng-model="income.amount" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="date">Creation date:</label>
            <div class="col-sm-9">
              <input type="datetime-local" value="{{current_date_value}}" class="form-control" id="date" placeholder="date"
                     ng-model="income.creationDate" required >
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-2">
              <button type="submit" class="btn btn-default submit-btn">Save</button>
            </div>
            <div class="col-sm-7">
              <button type="button" ng-click="cancel()" class="btn btn-default submit-btn">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    `;
    return editIncomeTemplate;
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
          <form class="form-horizontal" role="form" ng-submit="submit()">

          <br>

            <div class="form-group">
              <label class="control-label col-sm-1" for="date">Colour:</label>
              <div class="col-sm-3">
                <select class="form-control" ng-model="category.colour">
                  <option selected style="background-color: white" class="light">light</option>
                  <option style="background-color: cornsilk" class="stable">stable</option>
                  <option style="background-color: DodgerBlue " class="positive">positive</option>
                  <option style="background-color: aqua" class="calm">calm</option>
                  <option style="background-color: YellowGreen" class="balanced">balanced</option>
                  <option style="background-color: Gold" class="energized">energized</option>
                  <option style="background-color: Crimson " class="assertive">assertive</option>
                  <option style="background-color: BlueViolet " class="royal">royal</option>
                  <option style="background-color: black" class="dark">dark</option>
                </select>
              </div>
              <div class="col-sm-3">
                <input type="text" class="form-control" placeholder="New category name" ng-model="category.name">
              </div>
              <div class="col-sm-2">
                <input type="button" class="form-control" placeholder="Edit category" value="Edit" ng-click="submit()">
              </div>
              <div class="col-sm-2">
                <input type="button" class="form-control" placeholder="Cancel" value="Cancel" ng-click="cancel()">
              </div>
            </div>
          </label>
          <br>
          </form>
        </div>
      </div>
    `;
    return editCategoryTemplate;
  }

  return service;
});

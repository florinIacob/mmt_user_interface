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
                  <button style="left-margin:3px;" class="btn btn-primary" type="button" ng-click="yes()">{{isEng() ? 'Yes':'Da'}}</button>
                  <button class="btn btn-primary" type="button" ng-click="no()">{{isEng() ? 'No':'Nu'}}</button>
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
        <h2 style="text-align:center;"><img src="images/add_expense.png"> {{isEng() ? 'EDIT EXPENSE':'EDITEAZA CHELTUIALA'}}</h2>
        <form class="form-horizontal" role="form" ng-submit="submit()">
          <div class="form-group">
            <label class="control-label col-sm-2" for="name">{{isEng() ? 'Name':'Nume'}}:</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="name" placeholder="{{isEng() ? 'Expense name':'Numele cheltuielii'}}" ng-model="expense.name" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="date">{{isEng() ? 'Category':'Categoria'}}:</label>
            <div class="col-sm-4">
              <select type="date" class="form-control" id="category" placeholder="Category" ng-model="expense.category.name" required>
                <option ng-repeat="category in categories" value="{{category.name}}" required>{{category.name}}</option>
              </select>
            </div>
            <div class="col-sm-3">
              <input type="text" class="form-control" placeholder="{{isEng() ? 'New category':'Categorie noua'}}" ng-model="newCategory">
            </div>
            <div class="col-sm-2">
              <input type="button" class="form-control" placeholder="Add new category" value="{{isEng() ? 'Add':'Adauga'}}" ng-click="addCategory()">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="description">{{isEng() ? 'Description':'Descriere'}}:</label>
            <div class="col-sm-9">
              <textarea type="text" rows="5"  class="form-control" id="description" placeholder="{{isEng() ? 'Description':'Descriere'}} ..." ng-model="expense.description"/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="amount">{{isEng() ? 'Amount':'Suma'}}:</label>
            <div class="col-sm-9">
              <input type="number" step="any" class="form-control" id="amount" placeholder="{{isEng() ? 'Expense amount':'Suma cheltuielii'}}" ng-model="expense.amount" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="date">{{isEng() ? 'Creation date':'Data crearii'}}:</label>
            <div class="col-sm-9">
              <input type="datetime-local" value="{{current_date_value}}" class="form-control" id="date" placeholder="date"
                     ng-model="expense.creationDate" required >
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-2">
              <button type="submit" class="btn btn-default submit-btn">{{isEng() ? 'Save':'Salveaza'}}</button>
            </div>
            <div class="col-sm-7">
              <button type="button" ng-click="cancel()" class="btn btn-default submit-btn">{{isEng() ? 'Cancel':'Anuleaza'}}</button>
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
        <h2 style="text-align:center;"><img src="images/add_income.png"> {{isEng() ? 'EDIT INCOME':'EDITEAZA INCASAREA'}}</h2>
        <form class="form-horizontal" role="form" ng-submit="submit()">
          <div class="form-group">
            <label class="control-label col-sm-2" for="name">{{isEng() ? 'Name':'Nume'}}:</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="name" placeholder="{{isEng() ? 'Income name':'Numele incasarii'}}" ng-model="income.name" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="description">{{isEng() ? 'Description':'Descriere'}}:</label>
            <div class="col-sm-9">
              <textarea type="text" rows="5"  class="form-control" id="description" placeholder="{{isEng() ? 'Description':'Descriere'}} ..." ng-model="income.description"/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="amount">{{isEng() ? 'Amount':'Suma'}}:</label>
            <div class="col-sm-9">
              <input type="number" step="any" class="form-control" id="amount" placeholder="{{isEng() ? 'Income amount':'Suma incasarii'}}" ng-model="income.amount" required >
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2" for="date">{{isEng() ? 'Creation date':'Data crearii'}}:</label>
            <div class="col-sm-9">
              <input type="datetime-local" value="{{current_date_value}}" class="form-control" id="date" placeholder="date"
                     ng-model="income.creationDate" required >
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-2">
              <button type="submit" class="btn btn-default submit-btn">{{isEng() ? 'Save':'Salveaza'}}</button>
            </div>
            <div class="col-sm-7">
              <button type="button" ng-click="cancel()" class="btn btn-default submit-btn">{{isEng() ? 'Cancel':'Anuleaza'}}</button>
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
                  <button style="left-margin:3px;" class="btn btn-primary" type="button" ng-click="filter()">{{isEng() ? 'Filter':'Filtreaza'}}</button>
                  <button class="btn btn-primary" type="button" ng-click="cancel()">{{isEng() ? 'Cancel':'Anuleaza'}}</button>
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
          <h2 style="text-align:center;"><img src="images/expense_categories.svg"> {{isEng() ? 'EDIT CATEGORY':'EDITEAZA CATEGORIA'}}</h2>
          <form class="form-horizontal" role="form" ng-submit="submit()">

          <br>

            <div class="form-group">
              <label class="control-label col-sm-1" for="date">{{isEng() ? 'Colour':'Culoarea'}}:</label>
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
                <input type="text" class="form-control" placeholder="{{isEng() ? 'New category name':'Numele noii categorii'}}" ng-model="category.name">
              </div>
              <div class="col-sm-2">
                <input type="button" class="form-control" placeholder="{{isEng() ? 'Edit category':'Salveaza'}}" value="{{isEng() ? 'Edit':'Salveaza'}}" ng-click="submit()">
              </div>
              <div class="col-sm-2">
                <input type="button" class="form-control" placeholder="Cancel" value="{{isEng() ? 'Cancel':'Anuleaza'}}" ng-click="cancel()">
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

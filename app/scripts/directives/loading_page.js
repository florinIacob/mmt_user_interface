'use strict';

app.directive('loadingPage', function() {
    return {
        restrict: 'E',
        compile: function(element, attrs) {

            if (!attrs.width) {
              attrs.width = '300px';
            }
            console.log("  --- attrs.width: " + attrs.width);

            var displayMessage = '';
            if (attrs.message) {
              displayMessage = '<label class="text-center" style="width:100%;font-style:italic;">' + attrs.message + '</label>';
            }
            var htmlText = '<div class="container" style="height:100%;width:100%;padding:40px;">' +
                '<img class="center-block" ng-src="images/loading.gif" alt="Loading ..." style="width:' + attrs.width + ';"></img>' +
                displayMessage +
            '</div>';
            element.replaceWith(htmlText);
        }
    };
})

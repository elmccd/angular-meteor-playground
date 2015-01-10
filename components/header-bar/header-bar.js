if (Meteor.isClient) {
    angular.module('header-bar', [])
        .directive("headerBar", ['$window', '$interval', function($window, $interval) {
            return {
                scope: {

                },
                restrict: 'AE',
                template: UiRouter.template('header-bar.html'),
                link: function (scope, element) {

                }
            }
        }]);
}
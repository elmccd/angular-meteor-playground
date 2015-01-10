if (Meteor.isClient) {
    angular.module('chat-item', [])
        .directive("chatItem", ['$window', '$interval', function($window, $interval) {
            return {
                restrict: 'AE',
                template: UiRouter.template('chat-item.html'),
                link: function (scope, element) {

                }
            }
        }]);
}
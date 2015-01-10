if (Meteor.isClient) {
    angular.module('common', []);

    angular.module('common').filter("nl2br", ['$sce', function($sce) {
        return function(data) {
            if (!data) {
                return $sce.trustAsHtml('');
            }
            return $sce.trustAsHtml(data.replace(/\n\r?/g, '<br />'));
        };
    }]);

    angular.module('common').directive("amTimeAgo", ['$window', '$interval', function($window, $interval) {
        return {
            scope: {
                amTimeAgo: '='
            },
            link: function (scope, element) {
                var time = moment(scope.amTimeAgo);
                element.text(time.fromNow());

                var interval = $interval(function () {
                    element.text(time.fromNow());
                    console.log('update')
                }, 60e3);

                scope.$on("$destroy", function() {
                    $interval.cancel(interval)
                });

            }
        }
    }]);

}
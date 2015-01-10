Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {
    angular.module("chat", ['chat-item'])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('chat', {
                    url: "/chat",
                    template: UiRouter.template('chat.html'),
                    controller: 'PartiesController'
                });
        }
        ])
        .controller('PartiesController', ['$scope', '$collection', '$timeout', '$rootScope',
            function ($scope, $collection, $timeout, $rootScope) {

            $timeout(function () {
                $.material.init();
                $('[data-toggle]').tooltip();
                $('.perfect-scrollbar').perfectScrollbar();
            });

            $scope.parties = [];
            $scope.errors = {
                length: 0,
                items: {}
            };

            $collection(Parties).bind($scope, 'parties', true, true);

            $scope.userName = '';
            $scope.message = '';

            $scope.add = function () {

                if ($scope.message === '') {
                    $scope.errors.items.message = true;
                    $scope.errors.length += 1;
                }


                if ($scope.errors.length) {
                    return false;
                }

                $scope.parties.push({
                    author: Meteor.user().services.google,
                    message: $scope.message,
                    timestamp: new Date()
                });

                $scope.message = '';
            };

            $scope.$watchCollection('parties', function () {
                console.log('changed!');
                $timeout(function () {
                    if ($rootScope.me && $rootScope.me.settings && $rootScope.me.settings.autoScroll) {
                        $('.perfect-scrollbar').scrollTop($('.perfect-scrollbar > *').height());
                    }
                }, 100);
            });


            $timeout(function () {
                console.log('ddd');
                $('.perfect-scrollbar').scrollTop($('.perfect-scrollbar > *').height());
            }, 100);

            $scope.updateErrors = function () {
                $scope.errors = {
                    length: 0,
                    items: {}
                };

            };

            $scope.setSetting = function (name, value) {
                Meteor.call('setSetting', name, value);
            };

            $scope.messageKeyDown = function (event) {
                if (event.which === 13 && $rootScope.me.settings.submitOnEnter) {
                    event.preventDefault();

                    $scope.add();
                    return false;
                }
            }

        }]);
}

if (Meteor.isServer) {

    Meteor.publish("parties", function () {
        return Parties.find();
    });

    Parties.allow({
        insert: function (userId) {
            return userId;
        }
    });


}
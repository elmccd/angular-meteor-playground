if (Meteor.isClient) {
    Meteor.subscribe("userData");
    angular.module('party', [

        'angular-meteor',
        'monospaced.elastic',
        'ui.router',

        'common',

        'header-bar',
        'chat',
        'user',
        'board'
    ]);

    angular.module("party")
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('home', {
                    url: "/",
                    template: UiRouter.template('home.html')
                });
        }
        ]);

    Meteor.startup(function () {
        angular.bootstrap(document, ['party']);
    });
}

if (Meteor.isServer) {

    Meteor.methods({
        setSetting: function (name, value) {
            var updateObject = {};
            updateObject["settings." + name] = value;
            Meteor.users.update({_id: Meteor.userId()}, {
                $set: updateObject
            });
        }
    });


}
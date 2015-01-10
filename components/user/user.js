Users = Meteor.users;

if (Meteor.isClient) {
    angular.module("user", []);

    angular.module("user")
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider
                .state('login', {
                    url: "/login",
                    template: UiRouter.template('login.html')
                })
                .state('logout', {
                    url: "/logout",
                    controller: ['$state', function ($state) {
                        Meteor.logout();
                        $state.go('home')
                    }]
                });
        }
        ]);

    angular.module('user')
        .run(['$rootScope', '$collection', function ($rootScope, $collection) {

            $collection(Users).bind($rootScope, 'users', true, true);
            $collection(Users).bindOne($rootScope, 'me', Meteor.userId());

            $rootScope.loginWithGoogle = function () {
                return Meteor.loginWithGoogle();
            }
        }]);
}

if (Meteor.isServer) {

    Meteor.publish('users', function () {
        return Meteor.users.find({}, {
            fields: {
                'profile': 1,
                'services': 1,
                'settings': 1
            }
        });
    });

    Meteor.publish('me', function () {
        return Meteor.users.find({_id: Meteor.userId()}, {
            fields: {
                'profile': 1,
                'services': 1,
                'settings': 1
            }
        });
    });

    Meteor.publish("userData", function () {
        if (this.userId) {
            return Meteor.users.find({_id: this.userId},
                {fields: {'services': 1, 'others': 1}});
        } else {
            this.ready();
        }
    });

    ServiceConfiguration.configurations.remove({
        service: "google"
    });

    ServiceConfiguration.configurations.insert({
        service: "google",
        clientId: "932042629989-1qcug99s1b16t127klcn143k17rm0adq.apps.googleusercontent.com",
        secret: "T6jb3t7U3SNAbgT5Y5K3DGjN"
    });
}
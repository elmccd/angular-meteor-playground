Parties = new Mongo.Collection("parties");
Users = Meteor.users;

if (Meteor.isClient) {
  Meteor.subscribe("userData");
  angular.module('party', [

      'angular-meteor',
      'monospaced.elastic',
      'ui.router',

      'header-bar',
      'chat-item'
  ]);

  angular.module("party").config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/");

      $stateProvider
          .state('home', {
            url: "/",
            template: UiRouter.template('home.html')
          })
          .state('login', {
            url: "/login",
            template: UiRouter.template('login.html')
          })
          .state('chat', {
            url: "/chat",
            template: UiRouter.template('chat.html'),
            controller: 'PartiesController'
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

  angular.module('party')
      .run(['$rootScope', '$collection', function ($rootScope, $collection) {

        window.$rootScope = $rootScope;

        $collection(Users).bind($rootScope, 'users', true, true);
        $collection(Users).bindOne($rootScope, 'me', Meteor.userId());

        $rootScope.loginWithGoogle = function () {

          return Meteor.loginWithGoogle();
        }
      }])
      .controller('PartiesController', ['$scope', '$collection', '$timeout', function ($scope, $collection, $timeout) {

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

          console.log($scope);
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
            if ($rootScope.me.settings && $rootScope.me.settings.autoScroll) {
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
          console.log(name, value);
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

  angular.module('party').filter("nl2br", ['$sce', function($sce) {
    return function(data) {
      if (!data) {
        return $sce.trustAsHtml('');
      }
      return $sce.trustAsHtml(data.replace(/\n\r?/g, '<br />'));
    };
  }]);

  angular.module('party').directive("amTimeAgo", ['$window', '$interval', function($window, $interval) {
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

if (Meteor.isServer) {
  console.log('sdsd');
  Meteor.startup(function () {


    //Parties.remove({});

    if (Parties.find().count() === 0) {

      var parties = [];

    }
  });

  Parties.allow({
    insert: function (userId, party) {
      return userId;
    }
  });


  Meteor.methods({
    setSetting: function (name, value) {
      console.log(Meteor.userId());

      var updateObject = {};
      updateObject["settings." + name] = value;

      Meteor.users.update({_id: Meteor.userId()}, {
        $set: updateObject
      });
    }
  });

  Meteor.users.allow({
    update: function (userId, User) {
      console.log(userId, User);
      return false;
    }
  });

  Meteor.publish("parties", function () {
    return Parties.find();
  });

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
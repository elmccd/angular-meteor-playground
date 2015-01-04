Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {

  angular.module('party', ['angular-meteor', 'monospaced.elastic', 'ui.router']);

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
            controller: ['$location', function ($state) {
              Meteor.logout();
              $state.go('home')
            }]
          });
    }
  ]);

  Meteor.startup(function () {
    angular.bootstrap(document, ['party']);
  });

  angular.module('party')
      .run(function ($rootScope) {

        window.$rootScope = $rootScope;
        $rootScope.loginWithGoogle = function () {
          return Meteor.loginWithGoogle();
        }
      })
      .controller('PartiesController', function ($scope, $collection, $timeout) {

        $timeout(function () {
          $.material.init();
          $('[data-toggle]').tooltip();
        });

        $scope.parties = [];
        $scope.errors = {
          length: 0,
          items: {}
        };

        $collection(Parties).bind($scope, 'parties', true, true);

        $scope.userName = '';
        $scope.message = '';

        $scope.submitOnEnter = false;

        $scope.add = function () {

          console.log($scope);
          if ($scope.message === '') {
            $scope.errors.items.message = true;
            $scope.errors.length += 1;
          }

          if ($scope.userName === '') {
            $scope.errors.items.userName = true;
            $scope.errors.length += 1;
          }

          if ($scope.errors.length) {
            return false;
          }

          $scope.parties.push({
            author: $scope.userName,
            message: $scope.message,
            timestamp: new Date()
          });

          $scope.message = '';
        };

        $scope.updateErrors = function () {
          $scope.errors = {
            length: 0,
            items: {}
          };

        };

        $scope.messageKeyDown = function (event) {
          if (event.which === 13 && $scope.submitOnEnter) {
            event.preventDefault();

            $scope.add();
            return false;
          }
        }

      });

  angular.module('party').filter("nl2br", function($sce) {
    return function(data) {
      if (!data) {
        return $sce.trustAsHtml('');
      }
      return $sce.trustAsHtml(data.replace(/\n\r?/g, '<br />'));
    };
  });

  angular.module('party').directive("amTimeAgo", function($window) {
    return {
      scope: {
        amTimeAgo: '='
      },
      link: function (scope, element) {
        var time = moment(scope.amTimeAgo);
        element.text(time.fromNow());

        $window.setInterval(function () {
          element.text(time.fromNow());
        }, 60);
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Parties.remove({});
    if (Parties.find().count() === 0) {

      var parties = [];

    }
  });

  Parties.allow({
    insert: function (userId, party) {
      return userId;
    }
  });

  Meteor.publish("parties", function () {
    return Parties.find();
  });

// first, remove configuration entry in case service is already configured
  ServiceConfiguration.configurations.remove({
    service: "google"
  });

  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: "932042629989-1qcug99s1b16t127klcn143k17rm0adq.apps.googleusercontent.com",
    secret: "EaOX0amfo7UFFuQ06JuQtPOY"
  });

}

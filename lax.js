Parties = new Mongo.Collection("parties");

if (Meteor.isClient) {

  angular.module('party', ['angular-meteor', 'monospaced.elastic']);

  Meteor.startup(function () {
    angular.bootstrap(document, ['party']);
    $.material.init();
  });

  angular.module('party')
      .run(function ($rootScope) {

        window.$rootScope = $rootScope;
        $rootScope.logIn = function () {
          return Meteor.loginWithGoogle();
        }
      })
      .controller('PartiesController', function ($scope, $collection) {

        $scope.parties = [];
        $scope.errors = {
          length: 0,
          items: {}
        };

        $collection(Parties).bind($scope, 'parties', true, true);

        $scope.userName = '';
        $scope.message = '';

        $scope.add = function (val) {
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


  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
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

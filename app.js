if (Meteor.isClient) {
    Meteor.startup(function () {
        angular.bootstrap(document, ['party']);
    });
}
if (Meteor.isClient) {
    angular.module("board", [])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('board', {
                    url: "/board",
                    template: UiRouter.template('board.html'),
                    controller: 'BoardController'
                });
        }
        ])
        .controller('BoardController', ['$scope', '$collection', '$timeout', '$rootScope',
            function ($scope, $collection, $timeout, $rootScope) {



        }])
        .directive('drawingBoard', [function () {

            return {
                scope: {

                },
                link: function ($scope, $element, $attrs) {
                    var element = $element.get(0);
                    var width = 300;
                    var height = 300;
                    var fillColor = '#ddd';
                    var isDrawing = false;
                    var xOld, yOld;
                    element.width = width;
                    element.height = height;

                    var ctx = element.getContext('2d');


                    ctx.fillCircle = function(x, y, radius, fillColor) {
                        this.fillStyle = fillColor;
                        this.beginPath();
                        ctx.moveTo(xOld || x, yOld || y);
                        ctx.lineTo(x, y);
                        ctx.stroke();

                        xOld = x;
                        yOld = y;
                    };

                    ctx.clearTo = function(fillColor) {
                        ctx.fillStyle = fillColor;
                        ctx.fillRect(0, 0, width, height);
                    };

                    ctx.clearTo(fillColor || "#ddd");

                    // bind mouse events
                    element.onmousemove = function(e) {
                        if (!isDrawing) {
                            return;
                        }
                        console.log(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                        var x = e.pageX - this.offsetLeft;
                        var y = e.pageY - this.offsetTop;
                        var radius = 2; // or whatever
                        var fillColor = '#ff0000';
                        ctx.fillCircle(x, y, radius, fillColor);
                    };

                    element.onmousedown = function(e) {
                        isDrawing = true;
                    };

                    document.body.onmouseup = function(e) {
                        isDrawing = false;
                        xOld = yOld = null;
                    };

                    console.log($element);
                }
            }

        }]);
}

if (Meteor.isServer) {


}
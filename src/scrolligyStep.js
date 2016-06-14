angular.module('scrolligy')
    .directive('scrolligyStep', [function () {
        return {
            templateUrl: '..//src//scrolligyStep.html',
            scope: {
                templateUrl: '=',
                globalData: '=',
                controller: '=',
                data: '=stepData',
                scrolligyName: '=scrolligy'
            },
            //replace: true,
            restrict: 'EA',
            controller: ['$scope', '$controller', 'Scrolligy', function ($scope, $controller, Scrolligy) {
                var scrolligy;

                $scope.nextStep = function () {
                    scrolligy.next();
                };

                $scope.prevStep = function () {
                    scrolligy.previous();
                };

                $scope.addStep = function (step, index) {
                    scrolligy.addStep(step, index);
                };

                $scope.removeStep = function (index) {
                    scrolligy.removeStep(index);
                }

                function init() {
                    scrolligy = Scrolligy.get($scope.scrolligyName);

                    if ($scope.controller) {
                        $scope.controller = $controller($scope.controller, { $scope: $scope.$new() }).constructor
                    }
                }

                init();
            }]
        };
    }]);


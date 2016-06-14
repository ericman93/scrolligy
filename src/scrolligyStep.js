/**
 * Created by Aryeh on 06/06/2016.
 */
angular.module('scrolligy')
    .directive('scrolligyStep', [function () {
        return {
            template: '<div ng-include="templateUrl || \'scrolligyStep.html\'"></div>',
            scope: {
                templateUrl: '=',
                globalData: '=',
                data: '=stepData',
                scrolligyName: '=scrolligy'
            },
            replace: true,
            restrict: 'EA',
            controller: ['$scope', 'Scrolligy', function ($scope, Scrolligy) {
                var scrolligy;

                $scope.nextStep = function() {
                    scrolligy.next();
                };

                $scope.prevStep = function() {
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
                }
                
                init();
            }]
        };
    }]);


/**
 * Created by Aryeh on 06/06/2016.
 */
angular.module('scrolligy')
    .directive('scrolligyStep', [function () {
        return {
            template: '<div ng-include="templateUrl"></div>',
            scope: {
                templateUrl: '=',
                data: '=stepData',
                events: '='
            },
            replace: true,
            restrict: 'EA',
            controller: ['$scope', function($scope) {
                $scope.nextStep = function() {
                    raiseEvent('next');
                };

                $scope.prevStep = function() {
                    raiseEvent('previous');
                };
                
                $scope.addStep = function (step, index) {
                    raiseEvent('addStep', step, index);
                };

                function raiseEvent(name) {
                    callback = $scope.events[name];
                    if(callback) {
                        callback.apply(null, Array.prototype.slice.call(arguments, 1));
                    }
                }
            }]
        };
    }]);


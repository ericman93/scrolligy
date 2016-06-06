/**
 * Created by Aryeh on 06/06/2016.
 */
angular.module('scrolligy')
    .directive('scrolligyStep', [function () {
        return {
            templateUrl: function(elem, attrs) {
                return attrs.templateUrl || 'defaultStep.html';
            },
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
                
                $scope.addStep = function (url, data) {
                    raiseEvent('addStep', url, data);
                };
                
                function raiseEvent(name) {
                    callback = $scope.events[name];
                    if(callback) {
                        callback([].slice.call(arguments, 1))
                    }
                }
            }]
        }
    }]);


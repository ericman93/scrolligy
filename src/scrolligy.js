angular.module('scrolligy', [])
    .directive('scrolligy', [function () {
        return {
            templateUrl: function(elem, attrs) {
                return attrs.templateUrl || '..//src//scrolligy.html';
            },
            restrict: 'EA',
            replace: true,
            scope: {
                steps: '=',
                currentStep: '=',
                onRegisterApi: '='
            },
            controller: ['$scope', '$animate', function($scope, $animate){
                $scope.currentStep = $scope.currentStep || 0;

                $scope.next = function () {
                    if($scope.currentStep < $scope.steps.length - 1) {
                        $scope.currentStep++;
                    }
                };

                $scope.previous = function () {
                    if($scope.currentStep > 0) {
                        $scope.currentStep--;
                    }
                };

                $scope.addStep = function (args) {
                    console.log($scope.currentStep);
                    $scope.steps.splice($scope.currentStep-1,0, {
                        templateUrl: args[0],
                        icon: args[1],
                        data: args[2]
                    });
                };

                $scope.events = {
                    next: $scope.next,
                    addStep: $scope.addStep
                };

            }]
        };
    }]);
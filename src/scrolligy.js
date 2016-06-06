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

                $scope.addStep = function (step, index) {
                    step.index = index || $scope.currentStep;

                    incrementIndexOfFollowingSteps(step);

                    $scope.steps.splice(step.index, 0, step);
                };

                $scope.events = {
                    next: $scope.next,
                    addStep: $scope.addStep
                };

                function incrementIndexOfFollowingSteps(stepIndex) {
                    after = $scope.steps.filter(function (step) { return step.index >= stepIndex })
                    angular.forEach(after, function (step) {
                        step.index++; 
                    })
                }

            }]
        };
    }]);
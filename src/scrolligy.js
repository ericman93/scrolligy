angular.module('scrolligy', ['templates-dist']);

angular.module('scrolligy', [])
    .directive('scrolligy', [function () {
        return {
            templateUrl: function(elem, attrs) {
                return attrs.template || "../src/scrolligy.html";
            },
            restrict: 'EA',
            replace: true,
            scope: {
                steps: '=',
                currentStep: '=',
                onRegisterApi: '=',
                globalData: '='
            },
            controller: ['$scope', '$location', '$animate', function($scope, $location, $animate){
                $scope.currentStep = $scope.currentStep || 0;
                $location.search('step', $scope.currentStep);

                $scope.$watch('currentStep', function (newVal) {
                    $location.search('step', newVal);
                });

                $scope.$on('$locationChangeSuccess', function (event) {
                    var searchParams = $location.search();
                    var newStepNum = Number(searchParams.step);

                    ////////////////////////////////
                    //check for invalid step numbers
                    ////////////////////////////////

                    //non-number
                    if(isNaN(newStepNum)) {
                        newStepNum = 0;
                    }

                    //smaller than 0
                    if(newStepNum < 0) {
                        newStepNum = $scope.currentStep;
                    }

                    //larger than last step
                    if(newStepNum > $scope.steps.length - 1) {
                        newStepNum = $scope.currentStep;
                    }

                    $scope.currentStep = newStepNum;
                    $location.search('step', newStepNum);
                });

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

                    incrementIndexOfFollowingSteps(step.index);

                    $scope.steps.splice(step.index, 0, step);
                    sortStepsByIndex();
                };

                $scope.events = {
                    next: $scope.next,
                    addStep: $scope.addStep
                };

                function incrementIndexOfFollowingSteps(stepIndex) {
                    var after = $scope.steps.filter(function (step) {
                        return step.index >= stepIndex;
                    });
                    angular.forEach(after, function (step) {
                        step.index++; 
                    });
                }

                function sortStepsByIndex() {
                    $scope.steps.sort(function (a, b) {
                        return a.index - b.index;
                    });
                }

                function init() {
                    sortStepsByIndex();
                }

                init();
            }]
        };
    }]);
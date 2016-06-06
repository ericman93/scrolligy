angular.module('scrolligy')
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
            controller: ['$scope', '$attrs', '$location', '$animate', '$q', 'Scrolligy',
                        function ($scope, $attrs, $location, $animate, $q, Scrolligy) {
                
                var isRedirectedFromValidation = false;
                var goToIndex = 0;
                $scope.currentStep = $scope.currentStep || 0;
                $location.search('step', $scope.currentStep);

                $scope.$watch('currentStep', function (newVal, oldVal) {
                    if ((newVal != oldVal !== 0) && !isRedirectedFromValidation) {
                        preventStateChangeUntilValidation(oldVal);
                        goToIndex = newVal;
                    }
                    else {
                        isRedirectedFromValidation = false;
                        $location.search('step', newVal);
                    }
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
                    if ($scope.currentStep < $scope.steps.length - 1) {
                        $scope.currentStep++;
                    }
                };

                $scope.previous = function () {
                    if ($scope.currentStep > 0) {
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

                function preventStateChangeUntilValidation(stepIndex) {
                    $q.when(isValidStep(stepIndex)).then(function (data) {
                        console.log(data);
                        if (data === true) {
                            isRedirectedFromValidation = false;
                            $scope.currentStep = goToIndex;
                        }
                        else {
                            alert('invalid');
                        }
                    });

                    isRedirectedFromValidation = true;
                    $scope.currentStep = stepIndex;
                }

                function isValidStep(index) {
                    if ($scope.steps[index].isValid === undefined) {
                        return true;
                    }

                    return $q.when($scope.steps[index].isValid()).then(function (value) {
                        return value === undefined ? true : value;
                    }, function () {
                        return false;
                    });
                }

                function sortStepsByIndex() {
                    $scope.steps.sort(function (a, b) {
                        return a.index - b.index;
                    });
                }

                function init() {
                    $scope.currentStep = $scope.currentStep || 0;

                    sortStepsByIndex();

                    Scrolligy.register($attrs.id, {
                        next: $scope.next,
                        previous: $scope.previous,
                        addStep: $scope.addStep
                    });
                }

                init();
            }]
        };
    }]);

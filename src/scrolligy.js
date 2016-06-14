angular.module('scrolligy', [])
    .directive('scrolligy', [function () {
        return {
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || '..//src//scrolligy.html';
            },
            restrict: 'E',
            replace: true,
            scope: {
                steps: '=',
                globalData: '='
            },
            controller: ['$scope', '$attrs', '$location', '$animate', '$q', 'Scrolligy',
                function ($scope, $attrs, $location, $animate, $q, Scrolligy) {
                    $scope.next = function () {
                        if ($scope.currentStep < $scope.steps.length - 1) {
                            goToStep($scope.currentStep + 1);
                        }
                    };

                    $scope.previous = function () {
                        if ($scope.currentStep > 0) {
                            goToStep($scope.currentStep - 1);
                        }
                    };

                    $scope.addStep = function (step, index) {
                        step.index = index || $scope.currentStep;

                        incrementIndexOfFollowingSteps(step.index);

                        $scope.steps.splice(step.index, 0, step);
                        sortStepsByIndex();
                    };

                    $scope.$watch('currentStep', function (newVal, oldVal) {
                        $location.search('step', newVal);
                    });

                    $scope.$on('$locationChangeSuccess', function (event) {
                        var searchParams = $location.search();
                        var newStepNum = Number(searchParams.step);

                        ////////////////////////////////
                        //check for invalid step numbers
                        ////////////////////////////////

                        //non-number
                        if (isNaN(newStepNum)) {
                            newStepNum = 0;
                        }

                        //smaller than 0
                        if (newStepNum < 0) {
                            newStepNum = $scope.currentStep;
                        }

                        //larger than last step
                        if (newStepNum > $scope.steps.length - 1) {
                            newStepNum = $scope.currentStep;
                        }

                        goToStep(newStepNum);
                        $location.search('step', newStepNum);
                    })

                    function incrementIndexOfFollowingSteps(stepIndex) {
                        after = $scope.steps.filter(function (step) { return step.index >= stepIndex })
                        angular.forEach(after, function (step) {
                            step.index++;
                        })
                    }

                    function isValidStep(index) {
                        if ($scope.steps[index].isValid == undefined) {
                            return true;
                        }

                        return $q.when($scope.steps[index].isValid()).then(function (value) {
                            return value == undefined ? true : value;
                        }, function () {
                            return false;
                        });
                    }

                    function sortStepsByIndex() {
                        $scope.steps.sort(function (a, b) {
                            return a.index - b.index;
                        });
                    }

                    function invalidStep() {
                        alert('invalid');
                        $scope.step[$scope.currentStep].invalid = ture;
                    }

                    function goToStep(stepIndex) {
                        $q.when(isValidStep($scope.currentStep)).then(function (data) {
                            if (data == true) {
                                $scope.steps[$scope.currentStep].invalid = false;
                                $scope.currentStep = stepIndex;
                            }
                            else {
                                invalidStep();
                            }
                        }, function () {
                            invalidStep()
                        });
                    }

                    function init() {
                        $scope.name = $attrs.id;
                        $scope.currentStep = 0;
                        sortStepsByIndex();
                        $location.search('step', $scope.currentStep);

                        Scrolligy.register($attrs.id, {
                            next: $scope.next,
                            previous: $scope.previous,
                            addStep: $scope.addStep,
                            getCurrentStep: function () {
                                return $scope.currentStep;
                            },
                            goToStep: goToStep
                        })
                    }

                    init();
                }]
        };
    }]);
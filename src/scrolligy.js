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
                    function next() {
                        if ($scope.currentStep < $scope.steps.length - 1) {
                            goToStep($scope.currentStep + 1);
                        }
                    };

                    function previous() {
                        if ($scope.currentStep > 0) {
                            goToStep($scope.currentStep - 1);
                        }
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

                    function changeIndexOfFollowingSteps(stepIndex, offset) {
                        after = $scope.steps.filter(function (step) { return step.index >= stepIndex })
                        angular.forEach(after, function (step) {
                            step.index += offset;
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
                        $scope.steps[$scope.currentStep].invalid = true;
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

                    function addStep(step, index) {
                        step.index = index || $scope.currentStep;

                        changeIndexOfFollowingSteps(step.index, 1);

                        $scope.steps.splice(step.index, 0, step);
                        sortStepsByIndex();
                    }

                    function removeStep(index) {
                        changeIndexOfFollowingSteps(index, -1);
                        $scope.steps.splice(index, 1);

                        $scope.currentStep--;
                    }

                    function init() {
                        $scope.name = $attrs.id;
                        $scope.currentStep = 0;
                        sortStepsByIndex();
                        $location.search('step', $scope.currentStep);

                        Scrolligy.register($attrs.id, {
                            next: next,
                            previous: previous,
                            addStep: addStep,
                            removeStep: removeStep,
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
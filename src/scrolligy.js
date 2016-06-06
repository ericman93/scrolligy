angular.module('scrolligy', [])
    .directive('scrolligy', [function () {
        return {
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || '..//src//scrolligy.html';
            },
            restrict: 'EA',
            replace: true,
            scope: {
                steps: '=',
                currentStep: '=',
                onRegisterApi: '=',
                globalData: '='
            },
            controller: ['$scope', '$location', '$animate', '$q',
                function ($scope, $location, $animate, $q) {
                    var isRedirectedFromValidation = false;
                    var goToIndex = 0;

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

                    $location.search('step', $scope.currentStep);

                    $scope.$watch('currentStep', function (newVal, oldVal) {
                        if ((newVal != oldVal != 0) && !isRedirectedFromValidation) {
                            preventStateChangeUntilValidation(oldVal);
                            goToIndex = newVal;
                        }
                        else {
                            isRedirectedFromValidation = false;
                            $location.search('step', newVal);
                        }
                    });

                    $scope.$on('$locationChangeSuccess', function (event) {
                        $scope.currentStep = Number($location.search()['step']);
                    })

                    function incrementIndexOfFollowingSteps(stepIndex) {
                        after = $scope.steps.filter(function (step) { return step.index >= stepIndex })
                        angular.forEach(after, function (step) {
                            step.index++;
                        })
                    }

                    function preventStateChangeUntilValidation(stepIndex) {
                        $q.when(isValidStep(stepIndex)).then(function (data) {
                            console.log(data)
                            if (data == true) {
                                isRedirectedFromValidation = false;
                                $scope.currentStep = goToIndex;
                            }
                            else {
                                alert('invalid')
                            }
                        });

                        isRedirectedFromValidation = true;
                        $scope.currentStep = stepIndex;
                    }

                    function sortStepsByIndex() {
                        $scope.steps.sort(function (a, b) {
                            return a.index - b.index;
                        });
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

                    function init() {
                        $scope.currentStep = $scope.currentStep || 0;

                        sortStepsByIndex();
                    }

                    init();
                }]
        };
    }]);
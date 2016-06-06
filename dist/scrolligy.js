angular.module('scrolligy', ['templates-dist']);angular.module('scrolligy')
    .service('Scrolligy', [function () {
        var scrolligies = {};

        function register(name, scrolligy) {
            scrolligies[name] = scrolligy;
        }

        function unregister(name) {
            delete scrolligies[name];
        }

        function get(name) {
            return scrolligies[name];
        }

        return {
            register: register,
            unregister: unregister,
            get: get
        };
    }
]);;
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
;
/**
 * Created by Aryeh on 06/06/2016.
 */
angular.module('scrolligy')
    .directive('scrolligyStep', [function () {
        return {
            template: '<div ng-include="templateUrl"></div>',
            scope: {
                templateUrl: '=',
                globalData: '=',
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

                function init() {
                    if($scope.templateUrl === undefined) {
                        $scope.templateUrl = "/src/scrolligyStep.html";
                    }
                }
                
                init();
            }]
        };
    }]);

;
angular.module('templates-dist', ['scrolligy.html', 'scrolligyStep.html']);

angular.module("scrolligy.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scrolligy.html",
    "<div class=\"scrolligy\">\n" +
    "    <div ng-if=\"currentStep > 0\" class=\"step previous-step fade-step\">\n" +
    "        <div class=\"fade\"></div>\n" +
    "        <scrolligy-step events=\"events\"\n" +
    "                        template-url=\"steps[currentStep-1].templateUrl\"\n" +
    "                        step-data=\"steps[currentStep-1].data\"\n" +
    "                        global-data=\"globalData\">\n" +
    "        </scrolligy-step>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"step current-step\">\n" +
    "        <div class=\"fade\"></div>\n" +
    "        <scrolligy-step events=\"events\"\n" +
    "                        template-url=\"steps[currentStep].templateUrl\"\n" +
    "                        step-data=\"steps[currentStep].data\"\n" +
    "                        global-data=\"globalData\">\n" +
    "        </scrolligy-step>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"currentStep < (steps.length-1)\" class=\"step next-step fade-step\">\n" +
    "        <div class=\"fade\"></div>\n" +
    "        <scrolligy-step events=\"events\"\n" +
    "                        template-url=\"steps[currentStep+1].templateUrl\"\n" +
    "                        step-data=\"steps[currentStep+1].data\"\n" +
    "                        global-data=\"globalData\">\n" +
    "        </scrolligy-step>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("scrolligyStep.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("scrolligyStep.html",
    "<ul ng-if=\"data\">\n" +
    "    <li ng-repeat=\"element in data track by $index\">{{element}}</li>\n" +
    "</ul>\n" +
    "\n" +
    "<div>\n" +
    "    <button ng-click=\"nextStep()\">Next step</button>\n" +
    "    <br />\n" +
    "    <button ng-click=\"prevStep()\">Previous step</button>\n" +
    "</div>");
}]);

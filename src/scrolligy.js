angular.module('scrolligy', [])
    .directive('scrolligy', [function () {
        return {
            template: '<div>Hello</div>',
            restrict: 'E',
            controller: ['$scope', function($scope){
               
            }]
        };
    }]);
angular.module('scrolligy')
    .factory('Scrolligy', [function () {
        var scrolligies = {};

        function register(name, scrolligy) {
            scrolligies[name] = scrolligy
        }

        function unregister(name) {
            delete scrolligies[name];
        }

        function get(name) {
            return scrolligies[name]
        }

        return {
            register: register,
            unregister: unregister,
            get: get
        }
    }
]);
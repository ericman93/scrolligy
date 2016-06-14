angular.module('scrolligy')
    .constant('DefaultScrolligy', 'default-scrolligy')
    .service('Scrolligy', ['DefaultScrolligy', function (DefaultScrolligy) {
        var scrolligies = {};

        function register(name, scrolligy) {
            name = name || DefaultScrolligy;
            scrolligies[name] = scrolligy;
        }

        function unregister(name) {
            delete scrolligies[name];
        }

        function get(name) {
            var scrolligy = name in scrolligies ? name : DefaultScrolligy;
            return scrolligies[scrolligy];
        }

        return {
            register: register,
            unregister: unregister,
            get: get
        };
    }
    ]);
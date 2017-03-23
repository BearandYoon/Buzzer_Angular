angular.module('bzrdashApp').factory('dateFilterHttpInterceptor', ["$q", "$rootScope", "SERVERURL", function ($q, $rootScope, SERVERURL) {
    return {
        'request': function (config) {
            config.params = config.params || {};
            if (config.allowDateFilter && $rootScope.dateFilter.lastNDays) {
                config.params["lastNDays"] = $rootScope.dateFilter.lastNDays;
            }
            return config;
        },
    };
}]);
angular.module('bzrdashApp').factory('shopHttpInterceptor', ["$rootScope", function($rootScope) {
    return {
        'request': function(config) {
            config.headers = config.headers || {};
            var currentUser = $rootScope.getUserInfo();
            if (currentUser && currentUser.currentShopName) {
                config.headers["currentShopName"] = currentUser.currentShopName;
            }
            return config;
        }
    };
}]);
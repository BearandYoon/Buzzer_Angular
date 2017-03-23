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
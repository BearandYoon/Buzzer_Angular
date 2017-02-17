function rolesController($scope, $rootScope, $state, $filter, userManagementService) {
    var that = this;
    that.processed = false;
    userManagementService.getRoles().then(function (res) {
        that.roles = $filter('filter')(res, { name: '!Admin' });
        that.selectedRole = that.roles[0];
    });
    userManagementService.getPermissions().then(function (res) {
        that.permissions = res;
    });
    that.toggle = function (permission) {
        var current = $filter('filter')(that.selectedRole.permissions, permission);
        if (current.length > 0) { that.selectedRole.permissions = $filter('filter')(that.selectedRole.permissions, '!' + permission); }
        else {
            that.selectedRole.permissions.push(permission);
        }
    }
    that.save = function () {
        that.processed = false;
        userManagementService.saveRole(that.selectedRole).then(function (res) {
            var user = $rootScope.getUserInfo();
            if (that.selectedRole.name == user.roleName) {
                user.permissions = that.selectedRole.permissions.join(',');
                window.sessionStorage["userInfo"] = JSON.stringify(user);
            }
            that.processed = true;
        });
    }
    that.hasPermission = function (permission) {
        if (!that.selectedRole) { return false; }
        var filtered = $filter('filter')(that.selectedRole.permissions, permission);
        return filtered.length > 0;
    }
}
angular.module('bzrdashApp').controller('rolesController', ['$scope', '$rootScope', '$state', '$filter', 'userManagementService', rolesController]);

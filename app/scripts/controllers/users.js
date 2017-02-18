function usersController($scope, $rootScope, $state, $window, $filter, userManagementService) {
    var that = this;
    that.processed = false;
    userManagementService.getRoles().then(function (res) {
        that.roles = res;
        userManagementService.getUsers().then(function (res) {
            that.selectedUser = res[0];
            that.selectedRole = $filter('filter')(that.roles, { name: that.selectedUser.roleName })[0];
            that.users = res;
        });
    });
    that.save = function () {
        that.processed = false;
        that.selectedUser.roleName = that.selectedRole.name;
        userManagementService.saveUser(that.selectedUser.username, that.selectedUser.roleName).then(function (res) {
            var user = $rootScope.getUserInfo();
            if (that.selectedUser.username == user.username) {
                user.roleName = that.selectedRole.name;
                user.permissions = that.selectedRole.permissions.join(',');
                window.sessionStorage["userInfo"] = JSON.stringify(user);
            }
            that.processed = true;
        });
    }
    that.userChanged = function() {
        that.selectedRole = $filter('filter')(that.roles, { name: that.selectedUser.roleName })[0];
    }

}
angular.module('bzrdashApp').controller('usersController', ['$scope', '$rootScope', '$state', '$window', '$filter', 'userManagementService', usersController]);

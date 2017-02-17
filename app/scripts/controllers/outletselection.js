function outletSelectionCtrl($scope, $rootScope, $state, $window, userManagementService) {
    var that = this;

    that.pageTypes = [
        { page: 'app.dashboard', perm: 'dashboard' },
        { page: 'app.customer.care', perm: 'customercare' },
        { page: 'app.team.ranking', perm: 'staff' },
        { page: 'app.social.promote', perm: 'promote' },
        { page: 'app.apps.social', perm: 'news' },
        { page: 'app.settings.config', perm: 'settings' },
        { page: 'app.settings.roles', perm: 'roles' },
        { page: 'app.settings.users', perm: 'users' },
        { page: 'app.data.raw', perm: 'rawdata' },
    ];

    that.list = $rootScope.getUserInfo().shopName.split(',');
    that.onChoose = function (shop) {
        var userInfo = JSON.parse($window.sessionStorage["userInfo"]);
        userInfo.currentShopName = shop;
        $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);

        var allowedPage;
        that.pageTypes.forEach(function(i) {
            if (!allowedPage && $rootScope.hasPermission(i.perm)) {
                allowedPage = i;
            }
        });
        userManagementService.getRoles().then(function (r) {
            var currentRole = r.find(i => i.name === userInfo.roleName);
            if (currentRole) { userInfo.permissions = currentRole.permissions.join(','); }
            else { userInfo.permissions = ''; }
            
            $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            $state.go(allowedPage.page);
        }).catch(function () {
            userInfo.permissions = '';
            $state.go(allowedPage.page);
        });
    }
    if (that.list.length === 1) {
        that.onChoose(that.list[0]);
    }
}
angular.module('bzrdashApp').controller('outletSelectionCtrl', ['$scope', '$rootScope', '$state', '$window', 'userManagementService', outletSelectionCtrl]);
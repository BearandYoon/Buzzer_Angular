'use strict';

angular
    .module('bzrdashApp')
    .controller('AppCtrl', ['$scope', '$http', '$localStorage', '$location', '$state', '$window', 'authenticationService', 'OutletService', '$rootScope',
        function AppCtrl($scope, $http, $localStorage, $location, $state, $window, authenticationService, OutletService, $rootScope) {

            $scope.mobileView = 767;
            $rootScope.getUserInfo = function() {
                var userInfo = $window.sessionStorage["userInfo"];
                if (userInfo) { return JSON.parse(userInfo); }
                return undefined;
            }
            $rootScope.hasPermission = function(permission) {
                if (!permission) { return true; }
                var user = $rootScope.getUserInfo();
                if (!user || !user.roleName) { return false; }
                if (user.roleName.toLowerCase() === 'admin') { return true; }
                user.permissions = user.permissions || '';
                for (var i = 0; i < user.permissions.split(',').length; i++) {
                    if (user.permissions.split(',')[i] === permission) {
                        return true;
                    }
                }
                return false;
            }
            var isSmallSidebar = false;
            $scope.$window = $window;
            if ($window.innerWidth >= 992 && $window.innerWidth < 1200) {
                isSmallSidebar = true;
            }
            $scope.app = {
                name: 'bzrdash',
                author: 'Buzzer',
                version: '1.0.1',
                year: (new Date()).getFullYear(),
                layout: {
                    isSmallSidebar: isSmallSidebar,
                    isChatOpen: false,
                    isFixedHeader: true,
                    isFixedFooter: false,
                    isBoxed: false,
                    isStaticSidebar: false,
                    isRightSidebar: false,
                    isOffscreenOpen: false,
                    isConversationOpen: false,
                    isQuickLaunch: false,
                    isMobileSidebar: false,
                    sidebarTheme: '',
                    headerTheme: ''
                },
                isMessageOpen: false,
                isConfigOpen: false
            };

            $scope.user = {
                restaurantname: 'FigTree',
                location: 'Islington, London',
                logo: 'images/user/logo.jpg',
            };

            $scope.outlet = {};

            if (authenticationService.getUserInfo()) {
                OutletService.getOutlet().then(function(data) {
                    console.log('outlet', data);
                    $scope.outlet = data.outlet;
                });

            }

            $scope.buzzer = {
                logo: 'images/buzzer_logo.png'
            };

            if (angular.isDefined($localStorage.layout)) {
                $scope.app.layout = $localStorage.layout;
            } else {
                $localStorage.layout = $scope.app.layout;
            }

            $scope.$watch('app.layout', function() {
                $localStorage.layout = $scope.app.layout;
                if (authenticationService.getUserInfo()) {
                    OutletService.getOutlet().then(function(data) {
                        console.log('outlet', data);
                        $scope.outlet = data.outlet;
                    });

                }
            }, true);

            $rootScope.$watch('userInfo', function() {

                if (authenticationService.getUserInfo()) {
                    OutletService.getOutlet().then(function(data) {
                        console.log('outlet', data);
                        $scope.outlet = data.outlet;
                    });

                }
            }, true);


            $scope.getRandomArbitrary = function() {
                return Math.round(Math.random() * 100);
            };

            $scope.logout = function() {
                authenticationService.logout()
                    .then(function(result) {
                        // $scope.userInfo = null;
                        $location.path("/signin");
                    }, function(error) {
                        console.log(error);
                    });
            };

            $scope.lock = function() {
                authenticationService.lock()
                    .then(function(result) {
                        $state.go('user.lockscreen');
                    }, function(error) {
                        console.log(error);
                    });
            };

            var lockTimeout;

            function setLockTimeout() {
                lockTimeout = setTimeout(function() {
                    $scope.lock();
                }, 60 * 60 * 1000);  // 60 min
            }

            function clearLockTimeout() {
                clearTimeout(lockTimeout)
            }

            document.addEventListener('mousemove', function() {
                clearLockTimeout();
                setLockTimeout();
            });



            $scope.password = {};
            $scope.unlock = function() {
                var userName = authenticationService.getUserInfo().username;
                authenticationService.login(userName, $scope.password.unlock)
                    .then(function(result) {
                        $state.go('app.dashboard');
                    }, function(error) {
                        console.log(error);
                    });
            };
        }
    ]);

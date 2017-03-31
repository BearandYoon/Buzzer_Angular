angular
    .module('bzrdashApp')
    .controller('signinCtrl', ['$scope', '$location', '$window', 'authenticationService', '$timeout', '$rootScope', '$stateParams',
        function signinCtrl($scope, $location, $window, authenticationService, $timeout, $rootScope, $stateParams) {
            $scope.userInfo = null;

            var working = false;

            if ($stateParams.resetToken) {
                $scope.isReset = true;
            }

            $scope.login = function() {
                if (working) return;
                working = true;

                var $this = angular.element('.login'),
                    $mainButton = $this.find('button > .main-button');
                    $error = $this.find('.error');
                $mainButton.html('Loading');

                authenticationService.login($scope.userName, $scope.password)
                    .then(function(result) {
                        $this.addClass('ok');
                        $mainButton.html('Welcome back!');
                        $scope.userInfo = result;
                        $rootScope.userInfo = result;
                        $timeout(function() {
                            $rootScope.$apply();

                            $location.path("/");

                        }, 1200);
                        working = false;

                    }, function(error) {

                      $error.addClass('disp');
                      $mainButton.html('Log in');
                      working = false;
                      //$timeout(function(){history.go(0)}, 1500);
                      //  $window.alert("Your username or password was wrong. Please check and try again.");
                    });
            };

            $scope.cancel = function() {
                $scope.userName = "";
                $scope.password = "";
            };

            $scope.showForgot = function () {
                angular.element('.login').addClass('hidden');
                angular.element('.forgot').removeClass('hidden');
            };
            
            $scope.forgot = function () {
                authenticationService.forgot($scope.userName).then(function (result) {
                    angular.element('.forgot').html('Please click on link sent to your email to reset password.');
                }, function (error) {
                    angular.element('.forgotError').removeClass('hidden');
                });
            };

            $scope.reset = function () {
                if ($scope.resetPassword && $scope.resetPassword === $scope.verify) {
                    authenticationService.reset($scope.resetPassword, $stateParams.resetToken).then(function (result) {
                        $scope.resetSuccess = true;
                        $scope.resetError = false;
                    }, function (error) {
                        $scope.resetError = true;
                    });
                } else {
                    $scope.resetError = true;
                }
            }
        }
    ]);

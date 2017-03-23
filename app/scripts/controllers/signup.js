angular
    .module('bzrdashApp')
    .controller('signupCtrl', ['$scope', '$location', '$window', 'authenticationService',
        function signinCtrl($scope, $location, $window, authenticationService) {
            $scope.myForm = {};

            $scope.userInfo = null;

            $('#q1').keyup(function(e) {
                $("#displayname").html($(this).val());
                $("#displayname2").html($(this).val());
            });

            var formWrap = document.getElementById('fs-form-wrap');
            var formOptions = new window.FForm(formWrap, {
                onReview: function() {
                    classie.add(document.body, 'overview');
                }
            });

            $scope.sendAnswers = function(valid) {

                if (!valid) {
                    return
                }

                authenticationService.signUp($scope.myForm)
                    .then(function (result) {
                        $scope.userInfo = result;
                        $location.path("/");
                    }, function (error) {
                        $window.alert("Invalid credentials");
                    });
            };

        }
    ]);

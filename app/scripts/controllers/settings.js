'use strict';

function settingsCtrl($scope,$q, authenticationService, UserSettingsService, $window, QuestionsService, StaffService) {
    $scope.user = authenticationService.getUserInfo();

    $scope.tabs = [];
    $scope.newCategory = '';
    $scope.member = {
        tabs: []
    };
    $scope.isEditModal = false;

    $scope.staff = {};

    $scope.question = {};

    $scope.validationOpt = {
        rules: {
            emailfield: {
                required: false,
                email: true,
                minlength: 3
            },
            phonefield: {
                required: false
            },
            namefield: {
                required: false,
                minlength: 3
            },
            passwordfield: {
                required: false,
                minlength: 8
            },
            cpasswordfield: {
                required: false,
                minlength: 8,
                equalTo: '#newPasswordField'
            },
            description: {
                required: true
            },
            number: {
                required: true
            },
            name: {
                required: true
            },
            expiry: {
                required: true
            },
            cvc: {
                required: true
            }
        }
    };

    $scope.submitProfile = function () {
        UserSettingsService.setUserSettings($scope.user)
            .then(function (data) {
                $window.sessionStorage["userInfo"] = JSON.stringify(data);
            });
    };

    $scope.addStaffMember = function (member) {
        member.active = false;
        $scope.teams.push(angular.copy(member));
        $scope.modal = false;
    };

    function getStaff() {
        if ($scope.showLoading) {
            $scope.showLoading();
        }

        var promises = [
            QuestionsService.getAllQuestionsForever(),
            StaffService.getStaff()
        ];

        $q.all(promises).then(function(data) {
            $scope.questions = data[0];
            $scope.teams = data[1];
            
            console.log('$scope.questions=', $scope.questions); // eslint-disable-line no-console
            if ($scope.hideLoading) {
                $scope.hideLoading();
            }
        });
    }
    setTimeout(function () {
        getStaff();
    }, 0);

    $scope.addCategory = function(newCategory) {
        $scope.newCategory = '';
        $scope.tabs.push(newCategory);
    };

    $scope.openAddQuestionModal = function () {
        $scope.question = {
            type : 't',
            question: '',
            qFlag: 'email',
            editable: 'true',
            index: 0
        };
        $scope.modalAddquestion = true;
        $scope.isEditModal = false;
    }

    $scope.openEditQuestionModal = function (editedQuestion) {
        $scope.question = editedQuestion;
        $scope.modalAddquestion = true;
        $scope.isEditModal = true;
    }

    $scope.addQuestion = function (newquestion) {
        if (newquestion._id) {
            delete newquestion['_id'];
        }
        newquestion.outletID = $scope.outlet.outletID;
        newquestion._created_at = new Date();
        newquestion.active = true;
        console.log('newquestion=', newquestion); // eslint-disable-line no-console

        QuestionsService.addQuestion(newquestion)
            .then(function(data) {
                console.log('done=', data); // eslint-disable-line no-console
                $scope.modalAddquestion = false;
                $scope.isEditModal = false;
                getStaff();
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    $scope.editQuestion = function (question) {
        QuestionsService.editQuestion(question)
            .then(function(question) {
                $scope.modalAddquestion = false;
                $scope.isEditModal = false;
                getStaff();
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    $scope.editStaff = function(staff) {
        $scope.staff = staff;
        $scope.tabs = staff.tabs;
        $scope.modal = true;
        $scope.isEditModal = true;
    };

    $scope.closeModal = function() {
        $scope.modal = false;
        $scope.isEditModal = false;
    };

    $scope.closeQuestionModal = function() {
        $scope.modalAddquestion = false;
        $scope.isEditModal = false;
    };

    $scope.edit = function(staff) {
        StaffService.editStaff(staff)
            .then(function(staff) {
                $scope.modal = false;
                $scope.isEditModal = false;
                getStaff();
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.addStaff = function(newStaff) {
        newStaff._p_outletID = $scope.teams[0]._p_outletID;
        newStaff._created_at = new Date();
        newStaff.phone = '';
        newStaff.total = 0;
        newStaff.active = true;
        StaffService.addStaff(newStaff)
            .then(function(staff) {
                $scope.modal = false;
                getStaff();
            })
            .catch(function(err) {
                console.log(err);
            });
    };
}

angular
    .module('bzrdashApp')
    .controller('settingsCtrl', [
        '$scope',
        '$q',
        'authenticationService',
        'UserSettingsService',
        '$window',
        'QuestionsService',
        'StaffService',
        settingsCtrl]);

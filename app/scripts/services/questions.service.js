angular
    .module('bzrdashApp')
    .service('QuestionsService', ['$http', 'authenticationService', 'SERVERURL',
        function ($http, authenticationService, SERVERURL) {

            var QuestionsService = {};

            QuestionsService.getQuestions = function () {
                return $http.get(SERVERURL.url + 'questions/' + authenticationService.getUserInfo().loginToken, { allowDateFilter: true }).then(function(res) {
                    return res.data;
                });
            };

            QuestionsService.getQuestionsPreviousRange = function () {
                return $http.get(SERVERURL.url + 'questions/' + authenticationService.getUserInfo().loginToken, { allowDateFilter: true, params: {range: true} }).then(function(res) {
                    return res.data;
                });
            };

            QuestionsService.getQuestionsForever = function () {
                return $http.get(SERVERURL.url + 'questions/' + authenticationService.getUserInfo().loginToken, {params: {lastNDays: "0"}}).then(function(res) {
                    return res.data;
                });
            };

            QuestionsService.getAllQuestions = function () {
                return $http.get(SERVERURL.url + 'questions/all/' + authenticationService.getUserInfo().loginToken, { allowDateFilter: true }).then(function(res) {
                    return res.data;
                });
            };

            QuestionsService.getAllQuestionsForever = function () {
                return $http.get(SERVERURL.url + 'questions/all/' + authenticationService.getUserInfo().loginToken, {params: {lastNDays: "0"}}).then(function(res) {
                    return res.data;
                });
            };

            QuestionsService.getFeedbackById = function (flag) {
                return $http.get(SERVERURL.url + 'questions/flag/' + authenticationService.getUserInfo().loginToken + '?qFlag=' + flag, { allowDateFilter: true }).then(function(res) {
                    return res.data;
                });
            };

            QuestionsService.getFeedbackByDisplay = function (display) {
                return $http.get(SERVERURL.url + 'questions/flag/' + authenticationService.getUserInfo().loginToken + '?qDisplay=' + display, { allowDateFilter: true }).then(function(res) {
                    return res.data;
                });
            };

            QuestionsService.addQuestion = function (question) {
                return $http.post(SERVERURL.url + 'questions/' + authenticationService.getUserInfo().loginToken, question)
                    .then(function(res) {
                        return res.data;
                    });
            }

            QuestionsService.editQuestion = function (question) {
                return $http.post(SERVERURL.url + 'questions/edit/' + authenticationService.getUserInfo().loginToken, question)
                    .then(function(res) {
                        return res.data;
                    });
            };

            function getByFlag(flag) {
                return $http.get(SERVERURL.url + 'questions/flag/' + authenticationService.getUserInfo().loginToken + '?qFlag=' + flag).then(function(res) {
                    return res.data;
                });
            }

            return QuestionsService;
        }]);


'use strict';

function dashboardCtrl($scope, $interval, $q, $rootScope, COLORS, QuestionsService, FeedbacksService, WeeklySnapshotService,
    ReviewsService, authenticationService, auth, teamRankingService) {

    $scope.userInfo = auth;
    $rootScope.dateFilter.lastNDays = 7;

    $scope.showGraphInModal = false;

    $scope.showTableInModal = false;

    var visits = [
        [1, 8],
        [2, 1],
        [3, 1],
        [4, 6],
        [5, 1]
    ];

    $scope.questions = [];

    $scope.lineDataset = [{
        data: visits,
        color: COLORS.success
    }];

    $scope.lineOptions = {
        series: {
            lines: {
                show: true,
                lineWidth: 1,
                fill: true
            },
            shadowSize: 0
        },
        grid: {
            color: COLORS.border,
            borderWidth: 0,
            hoverable: true,
        },
        xaxis: {
            min: 1,
            max: 5
        },
        yaxis: {
            min: 0,
            max: 10
        }
    };


    $scope.barDataset = [{
        data: [],
        bars: {
            show: true,
            barWidth: 0.6,
            align: 'center',
            fill: true,
            lineWidth: 0,
            fillColor: COLORS.default
        }
    }];

    $scope.barFood = {
        show: true,
        barWidth: 0.8,
        align: 'center',
        fill: true,
        lineWidth: 0,
        fillColor: COLORS.default

    };


    $scope.barOptions = {
        grid: {
            hoverable: true,
            clickable: false,
            color: 'white',
            borderWidth: 0,
        },
        yaxis: {
            show: false
        },
        xaxis: {
            mode: 'categories',
            tickLength: 1,
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 10,
            axisLabelFontFamily: 'is',
            axisLabelPadding: 5
        }
    };

    var seriesData = [
        [],
        [],
        []
    ];
    var random = new Rickshaw.Fixtures.RandomData(150);

    for (var i = 0; i < 150; i++) {
        random.addData(seriesData);
    }


    $interval(function () {
        $scope.series = null;
        random.removeData(seriesData);
        random.addData(seriesData);

        $scope.series = [{
            data: seriesData[0],
        }, {
            data: seriesData[1],
        }];
    }, 1000);

    var seriesdataReviews = [
        [],
        [],
        []
    ];
    var seriesdataNPS = [
        [],
        [],
        []
    ];
    var randomNPS = new Rickshaw.Fixtures.RandomData(30);

    for (var v = 0; v < 30; v++) {
        randomNPS.addData(seriesdataReviews);
        randomNPS.addData(seriesdataNPS);
    }

    // NPS graph

    $scope.optionsNPS = {
        renderer: 'area',
        height: 133,
        padding: {
            top: 2,
            left: 0,
            right: 0,
            bottom: 0
        },
        interpolation: 'cardinal',
        stroke: true,
        strokeWidth: 1.5,
        preserve: true,
        min: 'auto'
    };

    $scope.featuresNPS = {

        hover: {
            xFormatter: function (x) {

                var title = $scope.npsGraphMapping[x];

                var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                var date = new Date(title);
                //Wednesday 28 Sept 2016
                return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
            },
            yFormatter: function (y) {
                return Math.round(y);
            }
        }
    };

    $scope.seriesNPS = [{
        color: 'rgba(0,217,255,0.09)',
        stroke: 'rgba(0,217,255,1)',
        name: 'Average NPS&reg; for day',
        data: seriesdataNPS[0]
    }];

    // Reviews graph

    $scope.optionsReviews = {
        renderer: 'area',
        height: 133,
        padding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        interpolation: 'cardinal',
        stroke: true,
        strokeWidth: 1.5,
        preserve: true,
    };

    $scope.featuresReviews = {

        hover: {
            xFormatter: function (x) {

                var title = $scope.feedbackGraphMapping[x];

                var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                var date = new Date(title);
                //Wednesday 28 Sept 2016
                return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
            },
            yFormatter: function (y) {
                return Math.round(y);
            }
        }
    };

    $scope.seriesReviews = [{
        color: 'rgba(0,217,255,0.09)',
        stroke: 'rgba(0,217,255,1)',
        name: 'Total reviews',
        data: [{
            x: 1,
            y: 50
        }, {
            x: 2,
            y: 72
        }, {
            x: 3,
            y: 63
        }, {
            x: 4,
            y: 44
        }, {
            x: 5,
            y: 75
        }, {
            x: 6,
            y: 66
        }, {
            x: 7,
            y: 87
        }]
    }];

    $scope.optionsModalGraph = {
        renderer: 'line',
        height: 300,
        width: 300,
        padding: {
            top: 0,
            left: 0.1,
            right: 0.1,
            bottom: 0
        },
        interpolation: 'cardinal',
        preserve: true,
        min: 'auto'
    };

    $scope.featuresModalGraph = {

        hover: {
            xFormatter: function (x) {

                var title = $scope.npsGraphMapping[x];

                var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                var date = new Date(title);
                //Wednesday 28 Sept 2016
                return days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
            },
            yFormatter: function (y) {
                return Math.round(y);
            }
        },
        xAxis: {
            type: 'X',
            ticks: 8,
            tickFormat: function (x) {
                var title = $scope.npsGraphMapping[x];

                var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                var date = new Date(title);
                //Wednesday 28 Sept 2016
                return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
            }
        },

        yAxis: {

        }
    };

    $scope.seriesModalGraph = [{
        color: 'rgba(0,217,255,0.09)',
        name: 'Total nps',
        data: []
    }, {
        color: '#00d9ff',
        name: 'Total reviews',
        data: []
    }];
    if ($scope.userInfo.enabled === false) {
        $scope.disabledModal = true;
        return;
    }



    $scope.Math = window.Math;



    $scope.feedbackGraphMapping = {};
    $scope.npsGraphMapping = {};
    $scope.serverGraphMapping = {};

    $scope.totalReviews = 0;
    $scope.toggleQuestionsModal = function (index) {
        $scope.questions.questions_modal ? $scope.questions.questions_modal = false : $scope.questions.questions_modal = true;
        $scope.questions.modalIndex = index;


        var question = $scope.questions[index];
        if (question.type === 's' || question.type==='n') {
            $scope.showGraphInModal = true;
            var data = processAnswers(question.response);
            $scope.seriesModalGraph[1].data = data;

            setTimeout(function () {
                $rootScope.$broadcast('recalculateSize');
            }, 0)
        } else {
            $scope.showGraphInModal = false;
            $scope.showTableInModal = true;

        }
    };

    function processAnswers(data) {
        var filteredData = [];
        if (data._created_at && typeof data._created_at === 'object') {
            var max;
            data._created_at.forEach(function(currentDate, index) {
                var timeString = (new Date(currentDate.slice(0, 10)));
                var time = (new Date(timeString)).getTime();
                var maxTime = (new Date(max)).getTime();
                if (!max || time > maxTime) {
                    max = timeString;
                }
            })

        } else {
            return filteredData;
        }
        for (i=$rootScope.dateFilter.lastNDays; i>=0; i--) {
            var date = new Date(max);
            date.setDate(date.getDate() - i);
            date.toDateString();
            var foundForCurrentDate = false;
            data._created_at.forEach(function(currentDate, index) {
                var dateString = (new Date(currentDate.slice(0, 10))).toDateString();
                if (dateString === date.toDateString()) {
                    filteredData.push({
                        x: ($rootScope.dateFilter.lastNDays -i),
                        y: data.nResponse[index]
                    });
                    foundForCurrentDate = true;
                }
            })

            if (!foundForCurrentDate) {
                filteredData.push({
                    x: ($rootScope.dateFilter.lastNDays -i),
                    y: 0
                });
            }
        }
        var refilteredData = [];

        filteredData.forEach(function (data) {
            if (!refilteredData[data.x]) {
                refilteredData[data.x] = {
                    x: data.x,
                    y: data.y,
                    count: 1
                }
            } else {
                refilteredData[data.x].y += data.y;
                refilteredData[data.x].count ++;
            }
        });

        refilteredData.forEach(function (data) {
            data.x = data.x * 1000000000;
            data.y = data.y/data.count;
        });

        return refilteredData;
    }

    function resolveAnswersForModal(data) {
        $scope.npsGraphMapping = {};
        for (var i = 0; i < data.chart.length; i++) {
            var ind = i * 1000000000;
            $scope.npsGraphMapping[ind] = data.chart[i].x;
            data.chart[i].x = ind;
        }
        $scope.seriesNPS[0].data = data.chart;
    }

    function resolveFeedbacks(data) {
        $scope.feedbackGraphMapping = {};
        for (var i = 0; i < data.chart.length; i++) {
            var ind = i * 1000000000;
            $scope.feedbackGraphMapping[ind] = data.chart[i].x;
            data.chart[i].x = ind;
        }
        $scope.seriesReviews[0].data = data.chart;
        $scope.totalReviews = data.sum;
    }

    function resolveQuestions(q, emailFeedbacks, npsFeedbacks, qForever, qPast) {
        $scope.questions = q;
        $scope.validDate = [7].indexOf($rootScope.dateFilter.lastNDays) > -1;
        var emailResponses = {};
        for (var i = 0; i < emailFeedbacks.length; i++) {
            emailResponses[emailFeedbacks[i].formID] = emailFeedbacks[i].tResponse;
        }
        var npsResponses = {};
        for (i = 0; i < npsFeedbacks.length; i++) {
            npsResponses[npsFeedbacks[i].formID] = npsFeedbacks[i].tResponse;
        }
        $scope.questions.forEach(function(question, idx) {
            question.foreverSummaryResponse = qForever.filter(function (q) {
                return question._id === q._id;
            })[0].summaryResponse;
            question.response.emails = question.response.formID.map(function (formID) {
                return (emailResponses[formID]);
            });
            question.response.nps = question.response.formID.map(function (formID) {
                return (npsResponses[formID]);
            });
            if (question.type === 's' || question.type === 'n' || question.type === 'nps') {
                if (qPast[idx].summaryResponse === -1) {
                    question.increase = undefined;
                    return;
                }
                question.change = (question.summaryResponse - qPast[idx].summaryResponse).toFixed(2);
                if (question.summaryResponse >= qPast[idx].summaryResponse) {
                    question.increase = true;
                } else {
                    question.increase = false;
                }
                question.change = Math.abs(question.change);
                if (question.change < 0.01) {
                    question.increase = 'NO';
                }
            }
        });

    }

    function resolveFeedbackNps(data) {
        $scope.npsGraphMapping = {};
        var data1 = {
            chart: []
        }
        for (var i = 0; i < data.chart.length; i++) {
            var ind = i * 1000000000;
            $scope.npsGraphMapping[ind] = data.chart[i].x;
            data.chart[i].x = ind;
            data1.chart[i] = {
                x: ind,
                y: data.chart[i].y/20
            }
        }
        $scope.seriesNPS[0].data = data.chart;
        $scope.seriesModalGraph[0].data = data1.chart;
    }

    function resolveFeedbackServers(data) {
        $scope.serverGraphMapping = {};
        for (var i = 0; i < data.chart.length; i++) {
            var ind = i * 1000000000;
            $scope.serverGraphMapping[ind] = data.chart[i].x;
            data.chart[i].x = ind;
        }
        $scope.barDataset[0].data = data.chart;
    }

    function resolveTeamRankings(data) {
        var awards = data.map(function (staff) {
            return staff.award;
        });
        var activeServerIdx = awards.map(function (award) {
            return award.indexOf('Highest amount of feedback') > -1;
        }).indexOf(true);
        if (activeServerIdx > -1) {
            $scope.activeServer = data[activeServerIdx];
        }
        var bestServerIdx = awards.map(function (award) {
            return award.indexOf('Best rated staff member') > -1;
        }).indexOf(true);
        if (bestServerIdx > -1) {
            $scope.bestServer = data[bestServerIdx];
        }
        var topNpsIdx = awards.map(function (award) {
            return award.indexOf('Top NPS') > -1;
        }).indexOf(true);
        if (topNpsIdx > -1) {
            $scope.topNpsServer = data[topNpsIdx];
        }
    }

    $scope.getAllData = function () {
        var questionsPromise = QuestionsService.getQuestions();
        var feedbacksContentPromise = FeedbacksService.getFeedbacksContent();
        var feedbacksPromise = FeedbacksService.getFeedbacks();

        var feedbackGetNpsPromise = FeedbacksService.getNPS();
        var feedbackGetServersPromise = FeedbacksService.getServers();

        var weeklySnapshotsPromise = WeeklySnapshotService.getWeeklySnapshots();

        var reviewsServicePromise = ReviewsService.getReviews();

        var reviewsServiceResponsePromise = ReviewsService.getResponseRate();

        var feedbackEmailsPromise = QuestionsService.getFeedbackById('email');
        var feedbackNPSPromise = QuestionsService.getFeedbackByDisplay("nps");

        var foreverQuestionsPromise = QuestionsService.getQuestionsForever();
        var pastQuestionsPromise = QuestionsService.getQuestionsPreviousRange();
        var teamRankingPromise = teamRankingService.getData();


        if ($scope.showLoading) {
            $scope.showLoading();
        }


        $q.all([
            questionsPromise,
            feedbacksContentPromise,
            feedbacksPromise,
            feedbackGetNpsPromise,
            feedbackGetServersPromise,
            weeklySnapshotsPromise,
            reviewsServicePromise,
            reviewsServiceResponsePromise,
            feedbackEmailsPromise,
            feedbackNPSPromise,
            foreverQuestionsPromise,
            pastQuestionsPromise,
            teamRankingPromise
        ]).then(function (data) {
            resolveQuestions(data[0], data[8], data[9], data[10], data[11]);
            resolveFeedbacks(data[2]);
            resolveFeedbackNps(data[3]);
            resolveFeedbackServers(data[4]);
            resolveTeamRankings(data[12]);
            $scope.weeklySnapshot = data[5];
            $scope.reviews = data[6];
            $scope.rate = data[7].rate;

            if ($scope.hideLoading) {
                $scope.hideLoading();
            }
        });
    }
    $scope.getAllData();

    $rootScope.$watch('dateFilter.lastNDays', function () {
        $scope.getAllData();
    });

    $scope.resize = function () {
        $rootScope.$broadcast('recalculateSize');
    }


}

angular
    .module('bzrdashApp')
    .controller('dashboardCtrl', ['$scope', '$interval', '$q', '$rootScope', 'COLORS', 'QuestionsService', 'FeedbacksService', 'WeeklySnapshotService', 'ReviewsService', 'authenticationService', 'auth', 'teamRankingService', dashboardCtrl]);

'use strict';


function promoteController($scope, $filter, $http, $rootScope, FeedbacksService, QuestionsService) {
    $scope.modal = false;
    $scope.isModalOpen = false;

    $scope.loadFeedback = function(isDateChange) {
        if ($scope.busy) { return; }
        $scope.busy = true;
        if ($scope.showLoading) {
            $scope.showLoading();
        }

        var offset = 0;
        if ($scope.feedbacks) {
            offset = $scope.feedbacks.length;
        }
        if (isDateChange) {
            offset = 0;
        }
        FeedbacksService.getFeedbacksContent(offset, 50)
        .then(function(data) {
            if ($scope.feedbacks && !isDateChange) {
                $scope.feedbacks = $scope.feedbacks.concat(data.feedbacks);
            } else {
                $scope.feedbacks = data.feedbacks;
            }
            var count = $scope.feedbacks.filter(function (feedback) {
                return feedback.type === 't' && !$scope.vaildateEmail(feedback.tResponse) && feedback.tResponse !== '';
            }).length;
            $scope.busy = false;
            if (count < 50 && data.feedbacks.length === 50) {
                $scope.loadFeedback();
            } else {
                if ($scope.hideLoading) {
                    $scope.hideLoading();
                }
            }
        });
    }
    $scope.loadFeedback();
    $rootScope.$watch('dateFilter.lastNDays', function() {
        $scope.loadFeedback(true);
    });

    // QuestionsService.getFeedbackById()
    //     .then(function(data) {
    //         console.log(data);
    //     });

    $scope.getDate = function(created_at) {
        var date = new Date(created_at);
        date = date.toString();
    //    var newDate = date.split(/\s+/).slice(1,5);
    //    return newDate[0] + ' ' + newDate[1] + ' ' + newDate[2];
    var newDate = date.split(/\s+/).slice(1,5);
    return newDate[0] + ' ' + newDate[1] + ' at ' + newDate[3];
    };

    $scope.export = function(comment, date) {
        $scope.modal = true;
        $scope.isModalOpen = true;
        var imgExport = document.querySelector('.img-export');
        document.querySelector('.modal-body').appendChild(convertImageToCanvas(imgExport, comment, date));

        var cleanDate = date.replace(new RegExp(' ', 'g'), '-').replace(new RegExp(':', 'g'), '-');
        document.querySelector('.modal-body').setAttribute('data-date', cleanDate);

        var canvas = document.querySelector('canvas');
        var img = convertCanvasToImage(canvas);
        var downloadBtn = document.querySelector('.download-btn');
        var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        downloadBtn.setAttribute('href', url);
        downloadBtn.setAttribute('download', 'BuzzerFeedbackImage-' + document.querySelector('.modal-body').getAttribute('data-date') + '.png');
    };

    $scope.vaildateEmail = function(response) {
        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(response);
    };

    $scope.closeModal = function() {
        $scope.modal = false;
        $scope.isModalOpen = false;
        var canvas = document.querySelector("canvas");
        canvas.parentNode.removeChild(canvas);
    };

    CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {

        var lines = text.split("\n");

        for (var i = 0; i < lines.length; i++) {

            var words = lines[i].split(' ');
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = this.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    this.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            this.fillText(line, x, y);
            y += lineHeight;
        }
    };

    function convertImageToCanvas(image, text, date) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        var contextDate = canvas.getContext("2d");
        contextDate.fillStyle = "black";
        contextDate.font = "33px 'is', Helvetica, Arial, sans-serif";
        contextDate.textAlign = "left";
        // context.fillText(text + '\n' + date, canvas.width/5, canvas.height/3 + 30);
        contextDate.wrapText( date , canvas.width/5, canvas.height-250, canvas.width/2, 100);
        var contextComment = canvas.getContext("2d");
        contextComment.fillStyle = "black";
        contextComment.font = "bold 39px 'is', Helvetica, Arial, sans-serif";
        contextComment.textAlign = "left";
        contextComment.wrapText(text , canvas.width/5, canvas.height/3 + 60, canvas.width/1.5, 66);
        // context.fillText(text, 0, 0);

        return canvas;
    }

    function convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image ;
    }
}


angular
    .module('bzrdashApp')
    .controller('promoteController', ['$scope', '$filter', '$http', '$rootScope', 'FeedbacksService', 'QuestionsService', promoteController]);

'use strict';

function mapCtrl($scope, $q, $rootScope, COLORS, MapService, FeedbacksService, QuestionsService, EmailsService) {

    var isInternetExplorer11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;
    var markerUrl = (isInternetExplorer11) ? 'images/cd-icon-location.png' : 'images/cd-icon-location.svg';

    var mainColor = COLORS.dark,
        saturationValue = -20,
        brightnessValue = 5;

    var style = [{
            //set saturation for the labels on the map
            elementType: 'labels',
            stylers: [{
                saturation: saturationValue
            }]
        }, { //poi stands for point of interest - don't show these lables on the map
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            //don't show highways lables on the map
            featureType: 'road.highway',
            elementType: 'labels',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            //don't show local road lables on the map
            featureType: 'road.local',
            elementType: 'labels.icon',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            //don't show arterial road lables on the map
            featureType: 'road.arterial',
            elementType: 'labels.icon',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            //don't show road lables on the map
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{
                visibility: 'off'
            }]
        },
        //style different elements on the map
        {
            featureType: 'transit',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'poi',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'poi.government',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'poi.sport_complex',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'poi.attraction',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'poi.business',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'transit',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'transit.station',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'landscape',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]

        }, {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }, {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{
                hue: mainColor
            }, {
                visibility: 'on'
            }, {
                lightness: brightnessValue
            }, {
                saturation: saturationValue
            }]
        }
    ];


    $scope.myMarkers = [];

    $scope.mapOptions = {
        scrollwheel: false,
        center: new google.maps.LatLng(51.5009562, -0.1215633),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: style
    };

    $scope.addMarker = function($event, $params) {
        var marker = new google.maps.Marker({
            map: $scope.myMap,
            position: $params[0].latLng,
            icon: markerUrl
        });

        $scope.myMarkers.push(marker);
    };

    $scope.setZoomMessage = function(zoom) {
        $scope.zoomMessage = 'You just zoomed to ' + zoom + '!';
    };

    $scope.openMarkerInfo = function(marker) {

        $scope.currentMarker = marker;
        $scope.currentMarkerLat = marker.getPosition().lat();
        $scope.currentMarkerLng = marker.getPosition().lng();
        $scope.myInfoWindow.open($scope.myMap, marker);
    };

    $scope.setMarkerPosition = function(marker, lat, lng) {
        marker.setPosition(new google.maps.LatLng(lat, lng));
    };

    MapService.getLocations()
        .then(function(postcodes) {
            postcodes.forEach(function(postcode) {
                MapService.getMappositions(postcode)
                    .then(function(data) {
                        var marker = new google.maps.Marker({
                            map: $scope.myMap
                        });
                        marker.setPosition(new google.maps.LatLng(data.result.latitude, data.result.longitude));

                        $scope.myMarkers.push(marker)
                    });
            });
        });

    FeedbacksService.getFeedbacksContent()
        .then(function(data) {
            $scope.feedbacks = data.feedbacks;
            console.log(data);
        });

    QuestionsService.getQuestions()
        .then(function(data) {
            console.log(data);
        });

    $scope.promoters = [];
    $scope.detractors = [];
    $scope.passives = [];

    $scope.getAllData = function() {
        var promises = [
            QuestionsService.getFeedbackById('email'),
            QuestionsService.getFeedbackById('comment'),
            QuestionsService.getFeedbackById('metric'),
            EmailsService.getEmails()
        ];


        if ($scope.showLoading) {
            $scope.showLoading();
        }

        $q.all(promises).then(function (data) {
            if ($scope.hideLoading) {
                $scope.hideLoading();
            }
            sortFeedbacks(data[0], data[1], data[2]);
            resolveEmails(data[3]);
        })
    }


    var feedBacksArray = [];

    function resolveEmails(emailData) {
        $scope.emailData = emailData;
        $scope.emailData.logs.forEach(function(log) {
            log._created_at = new Date(log._created_at).toLocaleString();
        });
    }

    function sortFeedbacks(emailArray, commentArray, metricArray) {
        feedBacksArray.length = 0;
        for (var i = 0; i < metricArray.length; i++) {
            feedBacksArray.push({
                metric: metricArray[i],
                email: getResponseByFlag(metricArray[i].formID, emailArray),
                comment: getResponseByFlag(metricArray[i].formID, commentArray)
            });
        }
        sortByResponse(feedBacksArray);
    }

    function getResponseByFlag(formID, feedbacks) {
        for (var i = 0; i < feedbacks.length; i++) {
            if (feedbacks[i].formID === formID) {
                return feedbacks[i];
            }
        }
    }
    $scope.allCommentsCSV = [];
    $scope.promotersCSV = [];
    $scope.detractorsCSV = [];
    $scope.passivesCSV = [];

    function sortByResponse(feedbacks) {
        $scope.allCommentsCSV.length = 0;
        $scope.promotersCSV.length = 0;
        $scope.detractorsCSV.length = 0;
        $scope.passivesCSV.length = 0;
        $scope.detractors.length = 0;
        $scope.promoters.length = 0;
        $scope.passives.length = 0;
        for (var i = 0; i < feedbacks.length; i++) {
            var comment;
            if ((feedbacks[i].metric.type === 's' && feedbacks[i].metric.nResponse <= 2.5) ||
                (feedbacks[i].metric.type === 'n' && feedbacks[i].metric.nResponse <= 6) ||
                (feedbacks[i].metric.type === 'nps' && feedbacks[i].metric.nResponse <= 6)) {
                if ((feedbacks[i].comment && feedbacks[i].comment.tResponse !== '') || (feedbacks[i].email&&feedbacks[i].email.tResponse !== '')) {
                    comment = {
                        category: 'detractors',
                        rating: feedbacks[i].metric.tResponse,
                        email: feedbacks[i].email.tResponse,
                        comment: feedbacks[i].comment.tResponse
                    }
                    $scope.detractorsCSV.push(comment);
                }
                $scope.detractors.push(feedbacks[i]);

            } else if ((feedbacks[i].metric.type === 's' && feedbacks[i].metric.nResponse >= 4) ||
                (feedbacks[i].metric.type === 'n' && feedbacks[i].metric.nResponse >= 9) ||
              (feedbacks[i].metric.type === 'nps' && feedbacks[i].metric.nResponse >= 9)) {
                if ((feedbacks[i].comment && feedbacks[i].comment.tResponse !== '') || (feedbacks[i].email&&feedbacks[i].email.tResponse !== '')) {
                    comment = {
                        category: 'promoters',
                        rating: feedbacks[i].metric.tResponse,
                        email: feedbacks[i].email.tResponse,
                        comment: feedbacks[i].comment.tResponse
                    }
                    $scope.promotersCSV.push(comment);
                }
                $scope.promoters.push(feedbacks[i]);

            } else if ((feedbacks[i].metric.type === 's' && feedbacks[i].metric.nResponse >= 2.6 && feedbacks[i].metric.nResponse <= 3.9) ||
                (feedbacks[i].metric.type === 'n' && feedbacks[i].metric.nResponse >= 7 && feedbacks[i].metric.nResponse <= 8) ||
              (feedbacks[i].metric.type === 'nps' && feedbacks[i].metric.nResponse >= 7 && feedbacks[i].metric.nResponse <= 8)) {

                if ((feedbacks[i].comment && feedbacks[i].comment.tResponse !== '') || (feedbacks[i].email&&feedbacks[i].email.tResponse !== '')) {
                    comment = {
                        category: 'passives',
                        rating: feedbacks[i].metric.tResponse,
                        email: feedbacks[i].email.tResponse,
                        comment: feedbacks[i].comment.tResponse
                    }
                    $scope.passivesCSV.push(comment);
                }

                $scope.passives.push(feedbacks[i]);

            }
            if ((feedbacks[i].comment && feedbacks[i].comment.tResponse !== '') || (feedbacks[i].email&&feedbacks[i].email.tResponse !== '')) {
                $scope.allCommentsCSV.push(comment);
            }
        }
    }

    $rootScope.$watch('dateFilter.lastNDays', function () {
        $scope.getAllData();
    });

}

angular
    .module('bzrdashApp')
    .controller('mapCtrl', ['$scope', '$q', '$rootScope', 'COLORS', 'MapService', 'FeedbacksService',
        'QuestionsService', 'EmailsService', mapCtrl]);

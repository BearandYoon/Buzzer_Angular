'use strict';

/**
 * @ngdoc overview
 * @name bzrdash
 * @description
 * # buzzerDashboard
 *
 * Main module of the application.
 */
angular
    .module('bzrdashApp', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'oc.lazyLoad',
        'ngStorage',
        'ngSanitize',
        'ui.utils',
        'ngTouch',
        'ui.map',
        'ngCsv',
        'checklist-model',
        'angulartics',
        'angulartics.scroll',
        'angulartics.google.analytics',
        'infinite-scroll',
        'daterangepicker'
    ])
    .constant('COLORS', {
        'default': '#e2e2e2',
        primary: '#ffb80f',
        success: '#2ECC71',
        warning: '#ffc65d',
        danger: '#d96557',
        info: '#4cc3d9',
        white: 'white',
        dark: '#4C5064',
        lightblue: '#0adaff',
        border: '#e4e4e4',
        bodyBg: '#e0e8f2',
        textColor: '#6B6B6B',
    })

.constant('SERVERURL', {
//           url: 'http://localhost:3000/'
        //    url: 'http://appsrv.getbuzzer.com/'
             url: 'https://ds.getbuzzer.com/'
});

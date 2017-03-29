'use strict';

angular
    .module('bzrdashApp')
    .run(['$rootScope', '$state', '$stateParams', '$timeout',
        function ($rootScope, $state, $stateParams, $timeout) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.dateFilter = {};
            $rootScope.$on('$stateChangeSuccess', function () {
                window.scrollTo(0, 0);
            });
            $rootScope.$on('$stateChangeStart', function (e, next) {
                if (next.data && !$rootScope.hasPermission(next.data.permissionRequired)) {
                    e.preventDefault();
                    $timeout(function () { $('.preloader').addClass('ng-hide'); }, 10);
                    $state.go('app.notauthorized');
                }
            });
            FastClick.attach(document.body);

            $rootScope.$on("$routeChangeSuccess", function (userInfo) {
                console.log(userInfo);
            });

            $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {

                if (eventObj.authenticated === false) {
                    $location.path("/signin");
                }
            });

        }
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            $httpProvider.interceptors.push('dateFilterHttpInterceptor');
            //  $locationProvider.html5Mode(true);
            // For unmatched routes
            $urlRouterProvider.otherwise('/');

            // Application routes
            $stateProvider
                .state('app', {
                    abstract: true,
                    templateUrl: 'views/common/layout.html',
                    resolve: {
                        auth: function ($q, authenticationService, $location) {

                            var userInfo = authenticationService.getUserInfo();
                            if (userInfo) {
                                return $q.when(userInfo);
                            } else {
                                $location.path("/signin");
                                return $q.reject({ authenticated: false });
                            }
                        }
                    }
                })
                .state('app.dashboard', {
                    url: '/',
                    controller: 'dashboardCtrl',
                    templateUrl: 'views/dashboard.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: [
                                        'styles/climacons-font.css',
                                        'vendor/rickshaw/rickshaw.min.css'
                                    ]
                                },
                                {
                                    serie: true,
                                    files: [
                                        'vendor/jquery.easy-pie-chart/dist/angular.easypiechart.js',
                                        'scripts/controllers/easychart.js',
                                        'scripts/services/questions.service.js',
                                        'scripts/services/feedbacks.service.js',
                                        'scripts/services/weekly-snapshot.service.js',
                                        'scripts/services/reviews.service.js',
                                        'scripts/services/team-ranking.service.js',
                                        'vendor/d3/d3.min.js',
                                        'vendor/rickshaw/rickshaw.min.js',
                                        'vendor/flot/jquery.flot.js',
                                        'vendor/flot/jquery.flot.resize.js',
                                        'vendor/flot/jquery.flot.pie.js',
                                        'vendor/flot/jquery.flot.categories.js'
                                    ]
                                },
                                {
                                    name: 'angular-flot',
                                    files: [
                                        'vendor/angular-flot/angular-flot.js'
                                    ]

                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/dashboard.js');

                                });
                        }],
                        // auth: function ($q, authenticationService, $location) {
                        //
                        //     var userInfo = authenticationService.getUserInfo();
                        //     if (userInfo) {
                        //         return $q.when(userInfo);
                        //     } else {
                        //         $location.path("/signin");
                        //         return $q.reject({authenticated: false});
                        //     }
                        // }
                    },
                    data: {
                        title: 'Dashboard',
                        permissionRequired: 'dashboard',
                    }
                })


                // UI Routes
                .state('app.ui', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/ui',
                })
                .state('app.ui.buttons', {
                    url: '/buttons',
                    templateUrl: 'views/ui-buttons.html',
                    data: {
                        title: 'Buttons',
                    }
                })
                .state('app.ui.directives', {
                    url: '/directives',
                    templateUrl: 'views/ui-general.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: [
                                        'vendor/checkbo/src/0.1.4/css/checkBo.min.css',
                                        'vendor/chosen_v1.4.0/chosen.min.css'
                                    ]
                                },
                                {
                                    files: [
                                        'vendor/checkbo/src/0.1.4/js/checkBo.min.js',
                                        'vendor/chosen_v1.4.0/chosen.jquery.min.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/bootstrap.ui.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Bootstrap Directives',
                    }
                })
                .state('app.ui.tabs_accordion', {
                    url: '/tabs_accordions',
                    templateUrl: 'views/ui-tabs-accordion.html',
                    data: {
                        title: 'Nav Tabs',
                    }
                })
                .state('app.ui.portlets', {
                    url: '/portlets',
                    templateUrl: 'views/ui-portlets.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    files: [
                                        'vendor/perfect-scrollbar/js/perfect-scrollbar.jquery.js',
                                        'vendor/jquery.ui/ui/core.js',
                                        'vendor/jquery.ui/ui/widget.js',
                                        'vendor/jquery.ui/ui/mouse.js',
                                        'vendor/jquery.ui/ui/sortable.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/draggable.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Portlets',
                    }
                })
                .state('app.ui.fontawesome', {
                    url: '/fontawesome',
                    templateUrl: 'views/ui-fontawesome.html',
                    data: {
                        title: 'Fontawesome Icons',
                    }
                })
                .state('app.ui.feather', {
                    url: '/feather',
                    templateUrl: 'views/ui-feather.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('styles/feather.css');
                        }]
                    },
                    data: {
                        title: 'Feather Icons',
                    }
                })
                .state('app.ui.climacon', {
                    url: '/climacon',
                    templateUrl: 'views/ui-climacon.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('styles/climacons-font.css');
                        }]
                    },
                    data: {
                        title: 'Climacon Icons',
                    }
                })
                .state('app.ui.progressbars', {
                    url: '/progressbars',
                    templateUrl: 'views/ui-progressbars.html',
                    data: {
                        title: 'Progress Bars',
                    }
                })
                .state('app.ui.sliders', {
                    url: '/sliders',
                    templateUrl: 'views/ui-sliders.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    files: [
                                        'vendor/jquery.ui/ui/core.js',
                                        'vendor/jquery.ui/ui/widget.js',
                                        'vendor/jquery.ui/ui/mouse.js',
                                        'vendor/jquery.ui/ui/slider.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/slider.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Sliders',
                    }
                })
                .state('app.ui.pagination', {
                    url: '/pagination',
                    templateUrl: 'views/ui-pagination.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('scripts/controllers/bootstrap.ui.js');
                        }]
                    },
                    data: {
                        title: 'Pagination',
                    }
                })
                .state('app.ui.notifications', {
                    url: '/notifications',
                    templateUrl: 'views/ui-notifications.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: ['vendor/chosen_v1.4.0/chosen.min.css']
                                },
                                {
                                    serie: true,
                                    files: [
                                        'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                        'vendor/noty/js/noty/packaged/jquery.noty.packaged.min.js',
                                        'scripts/extensions/noty-defaults.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/notifications.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Notifications',
                    }
                })
                .state('app.ui.alert', {
                    url: '/alert',
                    templateUrl: 'views/ui-alert.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: ['vendor/sweetalert/dist/sweetalert.css']
                                },
                                {
                                    name: 'oitozero.ngSweetAlert',
                                    files: [
                                        'vendor/sweetalert/dist/sweetalert.min.js',
                                        'vendor/angular-sweetalert/SweetAlert.min.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/alert.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Alerts',
                    }
                })


                .state('app.settings', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/settings',
                })
                .state('app.settings.config', {
                    url: '/',
                    templateUrl: 'views/settings.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: [
                                        'vendor/checkbo/src/0.1.4/css/checkBo.min.css',
                                        'vendor/chosen_v1.4.0/chosen.min.css'
                                    ]
                                },
                                {
                                    files: [
                                        'vendor/checkbo/src/0.1.4/js/checkBo.min.js',
                                        'vendor/chosen_v1.4.0/chosen.jquery.min.js',
                                        'vendor/card/lib/js/jquery.card.js',
                                        'vendor/bootstrap/js/tab.js',
                                        'vendor/jquery-validation/dist/jquery.validate.min.js',
                                        'vendor/twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                        'scripts/services/questions.service.js',
                                        'scripts/services/staff.service.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/settings.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Account settings',
                    }
                })
                .state('app.settings.roles', {
                    url: '/roles',
                    templateUrl: 'views/roles.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/roles.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Access Management',
                    }
                })
                .state('app.settings.users', {
                    url: '/users',
                    templateUrl: 'views/users.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/users.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Users Access Management',
                    }
                })
                .state('app.team', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/team',
                })
                .state('app.team.ranking', {
                    url: '/team-ranking?topId',
                    templateUrl: 'views/team-ranking.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: [
                                        'vendor/sortable/css/sortable-theme-bootstrap.css',
                                        'scripts/controllers/bootstrap.ui.js'
                                    ]
                                },
                                {
                                    files: [
                                        'vendor/sortable/js/sortable.min.js'
                                    ]
                                }]).then(function () {
                                    Sortable.init();
                                });
                        }]
                    },
                    data: {
                        title: 'Team rankings',
                        permissionRequired: 'staff',
                    }
                })

                .state('app.data', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/data',
                })
                .state('app.data.raw', {
                    url: '/raw',
                    templateUrl: 'views/raw-data.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: [
                                        'vendor/sortable/css/sortable-theme-bootstrap.css',
                                        'scripts/services/feedbacks.service.js',
                                        'scripts/services/questions.service.js',
                                        'scripts/controllers/bootstrap.ui.js'
                                    ]
                                },
                                {
                                    files: [
                                        'vendor/sortable/js/sortable.min.js'
                                    ]
                                }]).then(function () {
                                    Sortable.init();
                                    return $ocLazyLoad.load('scripts/controllers/data-raw.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Raw data',
                    }
                })


                .state('app.social', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/social',
                })
                .state('app.social.promote', {
                    url: '/promote',
                    templateUrl: 'views/promote.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: [
                                        'vendor/sortable/css/sortable-theme-bootstrap.css',
                                        'scripts/controllers/bootstrap.ui.js',
                                        'scripts/services/questions.service.js',
                                        'scripts/services/feedbacks.service.js',
                                        'images/dashboard_quote_blank.png'
                                    ]
                                },
                                {
                                    files: [
                                        'vendor/sortable/js/sortable.min.js'
                                    ]
                                }]).then(function () {
                                    Sortable.init();
                                    return $ocLazyLoad.load('scripts/controllers/promote.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Promote',
                    }
                })

                // Chart routes
                .state('app.charts', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/analysis',
                })
                .state('app.charts.chartjs', {
                    url: '/timeofday',
                    templateUrl: 'views/tod.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: [
                                        'vendor/chartjs/Chart.js',
                                    ]
                                },
                                {
                                    name: 'angles',
                                    serie: true,
                                    files: [
                                        'vendor/angles/angles.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/chartjs.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Time of day analysis',
                    }
                })

                // Maps routes
                .state('app.customer', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/customer',
                })
                .state('app.customer.map', {
                    url: '/map',
                    templateUrl: 'views/customer-map.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'ui.map',
                                    files: [
                                        'vendor/angular-ui-map/ui-map.min.js',
                                        'scripts/services/map.service.js'

                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/google.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Google Maps',
                        contentClasses: 'no-padding'
                    }
                })
                .state('app.customer.care', {
                    url: '/care',
                    templateUrl: 'views/customer-care.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'ui.map',
                                    files: [
                                        'vendor/angular-ui-map/ui-map.min.js',
                                        'scripts/services/map.service.js',
                                        'scripts/services/feedbacks.service.js',
                                        'scripts/services/questions.service.js'

                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/google.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Customer Care',
                        permissionRequired: 'customercare',
                        //  contentClasses: 'no-padding'
                    }
                })


                // Apps routes
                .state('app.apps', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/news',
                })

                .state('app.apps.social', {
                    url: '/feed',
                    templateUrl: 'views/news.html',
                    data: {
                        title: 'News',
                    }
                })


                // Apps routes
                .state('app.extras', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/extras',
                })
                .state('app.extras.popup', {
                    url: '/popup',
                    templateUrl: 'views/extras-popup.html',
                    data: {
                        title: 'Popup',
                    }
                })
                .state('app.extras.invoice', {
                    url: '/invoice',
                    templateUrl: 'views/extras-invoice.html',
                    data: {
                        title: 'Invoice',
                    }
                })
                .state('app.extras.timeline', {
                    url: '/timeline',
                    templateUrl: 'views/extras-timeline.html',
                    data: {
                        title: 'Timeline',
                    }
                })
                .state('app.extras.sortable', {
                    url: '/sortable',
                    templateUrl: 'views/extras-sortable.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    files: [
                                        'vendor/jquery.ui/ui/core.js',
                                        'vendor/jquery.ui/ui/widget.js',
                                        'vendor/jquery.ui/ui/mouse.js',
                                        'vendor/jquery.ui/ui/sortable.js'
                                    ]
                                }]).then(function () {
                                    return $ocLazyLoad.load('scripts/controllers/sortable.js');
                                });
                        }]
                    },
                    data: {
                        title: 'Sortable',
                    }
                })
                .state('app.extras.nestable', {
                    url: '/nestable',
                    templateUrl: 'views/extras-nestable.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('vendor/nestable/jquery.nestable.js');
                        }]
                    },
                    data: {
                        title: 'Nestable',
                    }
                })
                .state('app.extras.search', {
                    url: '/search',
                    templateUrl: 'views/extras-search.html',
                    data: {
                        title: 'Search',
                    }
                })
                .state('app.extras.changelog', {
                    url: '/changelog',
                    templateUrl: 'views/extras-changelog.html',
                    data: {
                        title: 'Changelog',
                    }
                })
                .state('app.extras.blank', {
                    url: '/blank',
                    templateUrl: 'views/extras-blank.html',
                    data: {
                        title: 'Blank Pages',
                    }
                })


                .state('app.widgets', {
                    url: '/widgets',
                    templateUrl: 'views/widgets.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    insertBefore: '#load_styles_before',
                                    files: [
                                        'styles/climacons-font.css',
                                        'vendor/checkbo/src/0.1.4/css/checkBo.min.css'
                                    ]
                                },
                                {
                                    files: [
                                        'vendor/checkbo/src/0.1.4/js/checkBo.min.js'
                                    ]
                                }]);
                        }]
                    },
                    data: {
                        title: 'Widgets',
                    }
                })


                .state('user', {
                    templateUrl: 'views/common/session.html',
                })
                .state('user.signin', {
                    url: '/signin',
                    templateUrl: 'views/extras-signin.html',
                    controller: 'signinCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                serie: true,
                                files: [
                                    'scripts/controllers/signin.js',
                                    'scripts/services/authentication.service.js'
                                ]
                            }]);
                        }]
                    },
                    data: {
                        appClasses: 'bg-white usersession',
                        contentClasses: 'full-height'
                    }
                })
                .state('user.signup', {
                    url: '/signup',
                    templateUrl: 'views/extras-signup.html',
                    controller: 'signupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                serie: true,
                                files: [
                                    'styles/signup.css',
                                    'vendor/form/form.js',
                                    'scripts/controllers/session.js',
                                    'scripts/controllers/signup.js',
                                    'scripts/services/authentication.service.js'
                                ]
                            }]);
                        }]
                    },
                    data: {
                        appClasses: 'bg-white usersession',
                        contentClasses: 'full-height'
                    }
                })
                .state('user.reset', {
                    url: '/reset/:resetToken',
                    templateUrl: 'views/extras-signin.html',
                    controller: 'signinCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([{
                                serie: true,
                                files: [
                                    'scripts/controllers/signin.js',
                                    'scripts/services/authentication.service.js'
                                ]
                            }]);
                        }]
                    }
                })
                .state('user.forgot', {
                    url: '/forgot',
                    templateUrl: 'views/extras-forgot.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('scripts/controllers/session.js');
                        }]
                    },
                    data: {
                        appClasses: 'bg-white usersession',
                        contentClasses: 'full-height'
                    }
                })

                .state('app.404', {
                    url: '/404',
                    templateUrl: 'views/extras-404.html',
                    data: {
                        title: 'Page Not Found',
                        contentClasses: 'no-padding',
                    }
                })
                .state('app.notauthorized', {
                    url: '/notauthorized',
                    template: '<span class="fa fa-lg fa-caret-left"></span> Please use the menu on the left to select a page'
                })
                .state('user.500', {
                    url: '/500',
                    templateUrl: 'views/extras-500.html',
                    data: {
                        appClasses: 'usersession',
                        contentClasses: 'full-height'
                    }
                })
                .state('user.lockscreen', {
                    url: '/lockscreen',
                    templateUrl: 'views/lock.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('scripts/controllers/session.js');
                        }]
                    },
                    data: {
                        appClasses: 'usersession',
                        contentClasses: 'full-height'
                    }
                })


                .state('app.documentation', {
                    url: '/help',
                    templateUrl: 'views/help.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    files: [
                                        'vendor/prism/themes/prism.css',
                                        'vendor/prism/prism.js',
                                    ]
                                }]);
                        }]
                    },
                    data: {
                        title: 'Help',
                        contentClasses: 'no-padding'
                    }
                });
        }
    ])
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false
        });
    }]);

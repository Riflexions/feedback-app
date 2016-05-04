'use strict';

/* Controllers */

angular.module('angularRestfulAuth')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function ($rootScope, $scope, $location, $localStorage, Main) {
        var changeLocation = function (url, replace, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if (forceReload || $scope.$$phase) {
                window.location = url;
            }
            if (replace) {
                $location.path(url).replace();
            } else {
                //this this if you want to change the URL and add it to the history stack
                $location.path(url);

            }

        };

        $scope.signin = function () {
            var inData = {
                user: {
                    email: $scope.email,
                    password: $scope.password
                }
            };

            Main.signin(inData).then(function (res) {
                if (res.type == false) {
                    alert(res.data)
                } else {

                    changeLocation('#/users', true, false);
                }
            }, function () {
                $rootScope.error = 'Failed to signin';
            });
        };

        $scope.signup = function () {
            var inData = {
                user: {
                    firstname: $scope.firstname,
                    lastname: $scope.lastname,
                    email: $scope.email,
                    password: $scope.password
                }
            };

            Main.signup(inData).then(function (res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    alert("Signed up. Please Login");
                    changeLocation('#/signin', true, false);
                }
            }, function () {
                $rootScope.error = 'Failed to signup';
            });
        };


        $scope.logout = function () {
            Main.logout(function () {
                delete $rootScope.token;
                delete $rootScope.currentUser;
                changeLocation('#/');
            }, function () {
                alert("Failed to logout!");
            });
        };
        $rootScope.token = $localStorage.token;
    }])
    .controller('UsersCtrl', ['$rootScope', '$scope', '$location', 'Main', function ($rootScope, $scope, $location, Main) {
        Main.users().then(function (res) {
            $rootScope.currentUser = Main.getCurrentUser();
            $scope.users = res.data.users;
        }, function () {
            $rootScope.error = 'Failed to fetch users';
        });
    }])
    .controller('QuestionsCtrl', ['$rootScope', '$scope', '$location', 'CRUD', function ($rootScope, $scope, $location, CRUD) {
        $scope.total = 0;
        $scope.page = 1;
        $scope.limit = 5;

        $scope.pageChanged = function (newPage) {
            CRUD.questions.findAll(newPage, $scope.limit).then(function (res) {

                $scope.questions = res.data.questions;
                var meta = res.data.meta;
                $scope.meta = meta;
                $scope.limit = meta.limit;
                $scope.total = meta.total;
                $scope.page = meta.page;


            }, function () {
                $rootScope.error = 'Failed to fetch questions';
            });
        };

        $scope.pageChanged($scope.page, $scope.limit);
    }]);

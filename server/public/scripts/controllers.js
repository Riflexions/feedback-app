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
            //$scope.$apply();
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
                    console.log("Auth success;data:", JSON.stringify(res.data, null, 4));
                    $localStorage.token = res.data.token;
                    $rootScope.token = $localStorage.token;
                    //$location.path("#/users").replace();
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
                    //$localStorage.token = res.data.token;
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
                changeLocation('#/');
            }, function () {
                alert("Failed to logout!");
            });
        };
        $rootScope.token = $localStorage.token;
    }])

    .controller('UsersCtrl', ['$rootScope', '$scope', '$location', 'Main', function ($rootScope, $scope, $location, Main) {
        Main.users().then(function (res) {
            console.log("Usere Fetch success;data:", JSON.stringify(res.data, null, 4));
            $scope.users = res.data.users;
        }, function () {
            $rootScope.error = 'Failed to fetch users';
        });
    }]);

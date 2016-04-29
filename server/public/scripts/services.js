'use strict';

angular.module('angularRestfulAuth')
    .factory('Main', ['$http', '$localStorage', '$timeout', function ($http, $localStorage, $timeout) {
        var baseUrl = "/api";

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();


        return {
            signup: function (data) {
                return $http.post(baseUrl + '/signup', data);
            },
            signin: function (data) {
                return $http.post(baseUrl + '/authenticate', data);
            },
            users: function () {
                return $http.get(baseUrl + '/users');
            },
            questions: function (page, limit) {
                var qString = '' + (page ? (limit ? 'page=' + page + '&limit=' + limit : 'page=' + page) : (limit ? 'limit=' + limit : ''));
                return $http.get(baseUrl + '/questions' + (qString ? '/?' + qString : ''));
            },
            getCurrentUser: function () {
                return currentUser;
            },
            logout: function (success) {
                changeUser({});
                delete $localStorage.token;
                $timeout(function () {
                    success();
                }, 110);


            }
        };
    }
    ]);
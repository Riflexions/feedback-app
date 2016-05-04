'use strict';
var baseUrl = "/api";
angular.module('angularRestfulAuth')
    .factory('Main', ['$rootScope', '$http', '$localStorage', '$timeout', '$q', function ($rootScope, $http, $localStorage, $timeout, $q) {


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
                $http.post(baseUrl + '/authenticate', data).then(function success(res) {
                    $localStorage.token = res.data.token;
                    $rootScope.token = $localStorage.token;
                    $rootScope.currentUser = res.data.user;
                    changeUser(res.data.user);
                    return $q.resolve(data);
                }, function (err) {
                    $q.reject(err);
                });
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
    }])
    .factory('CRUD', ['$http', function ($http) {


        function createCRUDOps(modelName) {
            var resUrl = baseUrl + '/' + modelName;
            return {
                find: function (id) {
                    return $http.get(resUrl + '/' + id);
                },
                findAll: function (page, limit) {
                    var config = {params: {}};
                    if (page) {
                        config.params.page = page;
                    }
                    if (limit) {
                        config.params.limit = limit
                    }
                    return $http.get(resUrl, config);
                },
                create: function (data) {
                    return $http.post(resUrl, data);
                },
                update: function (id, data) {
                    return $http.put(resUrl + '/' + id, data);
                },
                delete: function (id) {
                    return $http.delete(resUrl + '/' + id);
                },
                getChildren: function (parentObject, childName) {
                    var idArray = parentObject[childName];

                    if (typeof idArray !== 'undefined' && idArray instanceof Array) {
                        var promiseArray = idArray.map(function (id) {
                            return $http(baseUrl + '/' + childName + '/' + id);
                        });
                        return $q.all(promiseArray);
                    }
                    return $q.reject('Child Not found');

                }
            };
        }

        return {
            questions: createCRUDOps('questions'),
            questionnaires: createCRUDOps('questionnaires')
        };
    }]);
import 'babel/browser-polyfill';

import jquery from 'jquery';
import angular from 'angular';
import d2Angular from 'd2.angular';

import 'angular-route';

jquery.ajaxSetup({
    headers: {
        Authorization: 'Basic bWFya3BvOk1hcmtwbzEyMzQ='
    }
});

var app = angular.module('d2.angular.docs', ['d2-angular', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/buttons', {
                templateUrl: 'buttons/buttons.html'
            })
            .when('/inputs', {
                templateUrl: 'inputs/inputs.html'
            })
            .otherwise({
                templateUrl: 'main.html'
            });
    });

app.controller('selectFromListExampleController', function (models) {
    this.availableOptions = models.dataElement.list();
    this.selectedOptions = [];
});

d2Angular({
    baseUrl: 'http://localhost:8080/dhis/api/',
    appName: 'd2.angular.docs'
});

export default app;
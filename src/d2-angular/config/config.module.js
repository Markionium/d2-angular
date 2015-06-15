import angular from 'angular';

let configModule = angular.module('d2-angular.config', []);

configModule.value('DHIS2_BASEURL', '/dhis');

export default configModule;

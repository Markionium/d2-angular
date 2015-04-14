import angular from 'angular';

import selectFromListDirective from './select-from-list.directive';

angular.module('d2-angular.select-from-list', [])
    .directive('d2SelectFromList', selectFromListDirective);

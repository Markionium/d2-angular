import angular from 'angular';

import selectFromListDirective from 'd2-angular/select-from-list/select-from-list.directive';
import d2SelectFromListActions from 'd2-angular/select-from-list/select-from-list-actions.directive';

angular.module('d2-angular.select-from-list', [])
    .directive('d2SelectFromList', selectFromListDirective)
    .directive('d2SelectFromListActions', d2SelectFromListActions);

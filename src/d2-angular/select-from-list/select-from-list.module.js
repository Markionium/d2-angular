import angular from 'angular';

import d2SelectFromListDirective from 'd2-angular/select-from-list/select-from-list.directive';
import d2SelectFromListActions from 'd2-angular/select-from-list/select-from-list-actions.directive';

import {d2MultiSelectDirective, d2SelectFromListInfiniteScrollDirective, d2SelectFromListSearchFilterDirective} from 'd2-angular/select-from-list/select-from-list.directive';
import {d2MaskDirective} from 'd2-angular/select-from-list/select-from-list.directive';

angular.module('d2-angular.select-from-list', [])
    .directive('d2SelectFromList', d2SelectFromListDirective)
    .directive('d2SelectFromListActions', d2SelectFromListActions)
    .directive('d2SelectFromListInfiniteScroll', d2SelectFromListInfiniteScrollDirective)
    .directive('d2SelectFromListSearchFilter', d2SelectFromListSearchFilterDirective)
    .directive('d2MultiSelect', d2MultiSelectDirective)
    .directive('d2Mask', d2MaskDirective);

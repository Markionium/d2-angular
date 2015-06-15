import angular from 'angular';
import d2TableDirective from 'd2-angular/table/d2-table.directive';
import d2TablePagerDirective from 'd2-angular/table/d2-table-pager.directive';
import d2TableContextMenuDirective from 'd2-angular/table/d2-table-context-menu.directive';

import 'd2-angular/config/config.module';

//Build the angular module
angular.module('d2-angular.table', ['d2-angular.config']);
angular.module('d2-angular.table').directive('d2Table', d2TableDirective);
angular.module('d2-angular.table').directive('d2TablePager', d2TablePagerDirective);
angular.module('d2-angular.table').directive('d2TableContextMenu', d2TableContextMenuDirective);

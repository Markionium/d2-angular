import angular from 'angular';
import d2InputDirective from './d2-input.directive';

import 'd2-angular/effects/effects.module';

//Build the angular module
angular.module('d2-angular.input', ['d2-angular.effects']);
angular.module('d2-angular.input').directive('d2Input', d2InputDirective);

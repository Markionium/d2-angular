import angular from 'angular';
import d2ButtonDirective from 'd2-angular/button/d2-button.directive';

import 'd2-angular/effects/effects.module';

//Build the angular module
angular.module('d2-angular.button', ['d2-angular.effects']);
angular.module('d2-angular.button').directive('d2Button', d2ButtonDirective);

import angular from 'angular';
import d2InputDirective from 'd2-angular/input/d2-input.directive';

import 'd2-angular/effects/effects.module';

//Build the angular module
angular.module('d2-angular.input', ['d2-angular.effects'])
    .directive('d2Input', d2InputDirective)
    .value('INPUT_REQUIRED_ICON_CLASS', 'fa fa-asterisk input-required-icon');

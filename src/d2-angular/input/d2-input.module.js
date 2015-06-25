import angular from 'angular';
import d2InputDirective from 'd2-angular/input/d2-input.directive';
import d2CheckboxDirective  from 'd2-angular/input/d2-checkbox.directive';

import 'd2-angular/effects/effects.module';

//Build the angular module
angular.module('d2-angular.input', ['d2-angular.effects'])
    .directive('d2Input', d2InputDirective)
    .directive('d2Checkbox', d2CheckboxDirective)
    .value('INPUT_REQUIRED_ICON_CLASS', 'fa fa-asterisk input-required-icon');

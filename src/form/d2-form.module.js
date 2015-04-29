import angular from 'angular';
import d2FormDirective from './d2-form-for-model.directive';
import d2FormForModelFieldType from './d2-form-model-field-type.directive';
import d2FormFields from './d2-form-fields.service';

import 'd2-angular/input/d2-input.module';

//Build the angular module
angular.module('d2-angular.form', ['d2-angular.input'])
    .directive('d2FormForModel', d2FormDirective)
    .directive('d2FormForModelFieldType', d2FormForModelFieldType)
    .service('d2FormFields', d2FormFields);

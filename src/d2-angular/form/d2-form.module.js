import angular from 'angular';
import 'angular-formly';

import d2FormDirective from 'd2-angular/form/d2-form-for-model.directive';
import d2FormFields from 'd2-angular/form/d2-form-fields.service';
import configureAngularFormly from 'd2-angular/form/d2-formly.config';

import FormlyFieldsForModelService from 'd2-angular/form/d2-form-formly-fields-for-model.service';

import 'd2-angular/input/d2-input.module';

//Build the angular module
angular.module('d2-angular.form', ['formly', 'd2-angular.input'])
    .directive('d2FormForModel', d2FormDirective)
    .service('d2FormFields', d2FormFields)
    .run(configureAngularFormly);

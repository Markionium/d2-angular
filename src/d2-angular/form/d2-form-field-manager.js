'use strict';

import FormlyFieldsForModelService from 'd2-angular/form/d2-form-formly-fields-for-model.service';

import angular from 'angular';
const isString = angular.isString;

class D2FormFieldsManager {
    constructor(fieldsForModelService) {
        //fieldsToIgnore = fieldNamesToIgnoreOnDisplay, models = undefined

        this.fieldsForModelService = fieldsForModelService; // new FormlyFieldsForModelService(fieldsToIgnore, models);

        this.fieldOverrides = {};

        this.headerFields = [];
    }

    getFormFieldsForModel(model) {
        return this.fieldsForModelService.getFormlyFieldsForModel(model, this.fieldOverrides);
    }

    setFieldOrder(fieldNames) {
        this.fieldsForModelService.setDefaultFieldOrder(fieldNames);
        return this;
    }

    getHeaderFieldsForModel(model) {
        return this.getFormFieldsForModel(model)
            .filter((fieldConfig) => this.headerFields.indexOf(fieldConfig.key) !== -1);
    }

    getNonHeaderFieldsForModel(model) {
        return this.getFormFieldsForModel(model)
            .filter((fieldConfig) => this.headerFields.indexOf(fieldConfig.key) === -1);
    }

    setHeaderFields(fieldNames) {
        this.headerFields = Array.from(new Set(fieldNames));
        return this;
    }

    addFieldOverrideFor(fieldName, fieldConfig) {
        this.fieldOverrides[fieldName] = fieldConfig;
        return this;
    }
}

export default D2FormFieldsManager;

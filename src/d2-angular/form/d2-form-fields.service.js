'use strict';

import angular from 'angular';

import FormlyFieldsForModelService from 'd2-angular/form/d2-form-formly-fields-for-model.service';
import D2FormFieldsManager from 'd2-angular/form/d2-form-field-manager';

let headerFieldNames = ['name', 'shortName', 'code'];
let typeMap = {
    text: ['TEXT', 'IDENTIFIER'],
    select: ['CONSTANT'],
    reference: ['REFERENCE']
};

class D2FormFields {
    constructor(models) {
        this.models = models;
    }
    getManager(fieldsToIgnore) {
        return new D2FormFieldsManager(new FormlyFieldsForModelService(fieldsToIgnore, this.models));
    }
}

export default D2FormFields;

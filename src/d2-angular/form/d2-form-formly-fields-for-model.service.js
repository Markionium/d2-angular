'use strict';

import {fieldTypeClasses, typeToFieldMap} from 'd2-angular/form/fields/fields';

const fieldNamesToIgnoreOnDisplay = ['id', 'publicAccess', 'created', 'lastUpdated', 'user', 'userGroupAccesses', 'attributeValues'];

class FormlyFieldsForModelService {

    constructor(FIELDS_TO_IGNORE_ON_DISPLAY = fieldNamesToIgnoreOnDisplay, models = undefined) {
        this.fieldNamesToIgnoreOnDisplay = FIELDS_TO_IGNORE_ON_DISPLAY;
        this.fieldOrder = [];
        this.models = models;
    }

    setDefaultFieldOrder(fieldNames) {
        this.fieldOrder = fieldNames || [];
    }

    getFormlyFieldsForModel(model, fieldOverrides = {}) {
        if (!(model && model.modelDefinition && model.modelDefinition.modelValidations)) {
            throw new TypeError('Passed model does not seem to adhere to the d2 model structure ' +
                '(model.modelDefinition.modelValidations is not available)');
        }

        let removeFieldsThatShouldNotBeDisplayed = modelValidation => this.fieldNamesToIgnoreOnDisplay
            .indexOf(modelValidation.fieldName) === -1;
        let onlyUsableFieldTypes = modelValidation => fieldTypeClasses.get(typeToFieldMap.get(modelValidation.type));
        let onlyWritableProperties = modelValidation => modelValidation.writable;
        let onlyPersistedProperties = modelValidation => modelValidation.persisted;
        let onlyOwnedProperties = modelValidation => modelValidation.owner;
        let toArrayOfValidationObjects = fieldName => {
            let modelValidation = Object.create(model.modelDefinition.modelValidations[fieldName]);
            modelValidation.fieldName = fieldName;
            return modelValidation;
        };

        let fieldInstances =  Object.keys(model.modelDefinition.modelValidations)
            .map(toArrayOfValidationObjects)
            .filter(onlyWritableProperties)
            .filter(onlyPersistedProperties)
            .filter(onlyOwnedProperties)
            .filter(removeFieldsThatShouldNotBeDisplayed)
            .filter(onlyUsableFieldTypes)
            .map(modelValidation => getFieldClassInstance.bind(this)(modelValidation, fieldOverrides));

        if (!this.fieldOrder || !this.fieldOrder.length) {
            return fieldInstances;
        }
        return fieldInstances
                .filter(field => this.fieldOrder.indexOf(field.key) !== -1)
                .sort((left, right) => this.fieldOrder.indexOf(left.key) > this.fieldOrder.indexOf(right.key) ? 1 : -1)
                .concat(fieldInstances.filter(field => this.fieldOrder.indexOf(field.key) === -1));

        function getFieldClassInstance(modelValidation, fieldOverrides) {
            //jshint validthis:true
            let overrideConfig = fieldOverrides[modelValidation.fieldName];
            let isOverridden = !!overrideConfig;
            let fieldType = typeToFieldMap.get(modelValidation.type);
            if (isOverridden) {
                if (overrideConfig.type) {
                    fieldType = overrideConfig.type;
                }

                Object.keys(overrideConfig)
                    .filter(key => key !== 'type')
                    .forEach(key => {
                        modelValidation[key] = overrideConfig[key];
                    });
            }

            return fieldTypeClasses
                .get(fieldType)
                .create(modelValidation, this.models);
        }
    }
}

export default FormlyFieldsForModelService;

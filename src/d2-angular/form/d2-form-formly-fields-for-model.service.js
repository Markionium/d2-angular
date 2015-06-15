'use strict';

import {fieldTypeClasses, typeToFieldMap} from 'd2-angular/form/fields/fields';

class FormlyFieldsForModelService {
    constructor(FIELDS_TO_IGNORE_ON_DISPLAY) {
        this.fieldNamesToIgnoreOnDisplay = FIELDS_TO_IGNORE_ON_DISPLAY;
    }
    getFormlyFieldsForModel(model) {
        if (!(model && model.modelDefinition && model.modelDefinition.modelValidations)) {
            throw new TypeError('Passed model does not seem to adhere to the d2 model structure ' +
                '(model.modelDefinition.modelValidations is not available)');
        }

        let removeFieldsThatShouldNotBeDisplayed = modelValidation => this.fieldNamesToIgnoreOnDisplay
            .indexOf(modelValidation.fieldName) === -1;
        let onlyUsableFieldTypes = modelValidation => fieldTypeClasses.get(typeToFieldMap.get(modelValidation.type));
        let onlyWritableProperties = modelValidation => modelValidation.writable;
        let toArrayOfValidationObjects = fieldName => {
            let modelValidation = Object.create(model.modelDefinition.modelValidations[fieldName]);
            modelValidation.fieldName = fieldName;
            return modelValidation;
        };

        return Object.keys(model.modelDefinition.modelValidations)
            .map(toArrayOfValidationObjects)
            .filter(onlyWritableProperties)
            .filter(removeFieldsThatShouldNotBeDisplayed)
            .filter(onlyUsableFieldTypes)
            .map(modelValidation => {
                let fieldClass = fieldTypeClasses.get(typeToFieldMap.get(modelValidation.type));
                return fieldClass.create(modelValidation);
            });
    }
}

export default FormlyFieldsForModelService;

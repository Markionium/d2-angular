'use strict';

import Field from 'd2-angular/form/fields/Field';

class MultiSelectBox extends Field {
    constructor(options) {
        super(options);

        this.type = 'multiselect';
        this.data = this.data || {};
        this.data.referenceType = options.referenceType;
        this.data.source = options.source || [];
    }

    static create(modelValidation, models) {
        modelValidation.templateOptions = modelValidation.templateOptions || {};

        if (models[modelValidation.referenceType]) {
            modelValidation.source = models[modelValidation.referenceType].list();
            modelValidation.referenceType = models[modelValidation.referenceType];
            return new MultiSelectBox(modelValidation);
        }
        //FIXME: Don't allow MultiSelectBoxes without source;
        return new MultiSelectBox(modelValidation);
        throw new Error('Passed model does not have the the a reference to the type: ' + modelValidation.referenceType);
    }
}
MultiSelectBox.FIELDS_NOT_TO_COPY = MultiSelectBox.FIELDS_NOT_TO_COPY.concat(['source', 'referenceType']);

export default MultiSelectBox;

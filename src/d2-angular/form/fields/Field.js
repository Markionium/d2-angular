'use strict';

import {camelCaseToUnderscores} from 'd2-angular/helpers/helpers';

class Field {
    constructor(options = {}) {
        if (!options.fieldName) {
            throw new Error('fieldName is a required option to supply');
        }

        this.key = options.fieldName;
        this.type = 'input';
        this.templateOptions = {
            label: camelCaseToUnderscores(options.fieldName),
            required: options.required,
            minLength: options.min,
            maxLength: options.max
        };

        //Copy over any properties that are not within the filtered list
        Object.keys(options)
            .filter(optionKey => this.constructor.FIELDS_NOT_TO_COPY.indexOf(optionKey) === -1)
            .forEach(optionKey => this[optionKey] = options[optionKey]);
    }

    static create(options) {
        return new this(options);
    }
}
Field.FIELDS_NOT_TO_COPY = ['type', 'fieldName', 'templateOptions'];

export default Field;

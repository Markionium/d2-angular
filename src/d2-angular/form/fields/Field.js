'use strict';

class Field {
    constructor(options) {
        this.key = options.fieldName;
        this.type = 'input';
        this.templateOptions = {
            label: options.fieldName,
            required: options.required
        };
    }

    static create(options) {
        return new this(options);
    }
}

export default Field;

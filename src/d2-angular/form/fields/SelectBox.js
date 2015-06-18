'use strict';

import Field from 'd2-angular/form/fields/Field';

class SelectBox extends Field {
    constructor(options) {
        super(options);

        this.type = 'select';

        this.templateOptions.options = options.templateOptions && options.templateOptions.options || options.constants || [];

        this.templateOptions.options = this.templateOptions.options
            .map(constant => ({name: constant, value: constant}));
    }
}

export default SelectBox;

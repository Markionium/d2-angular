'use strict';

import Field from 'd2-angular/form/fields/Field';

class SelectBox extends Field {
    constructor(options) {
        super(options);

        this.type = 'select';
    }
}

export default SelectBox;

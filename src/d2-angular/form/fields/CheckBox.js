'use strict';

import Field from 'd2-angular/form/fields/Field';

class CheckBox extends Field {
    constructor(options) {
        super(options);

        this.type = 'checkbox';
    }
}

export default CheckBox;

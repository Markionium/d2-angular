'use strict';

import Field from 'd2-angular/form/fields/Field';

class TextBox extends Field {
    constructor(options) {
        super(options);

        this.type = 'text';
    }
}

export default TextBox;

'use strict';

import Field from 'd2-angular/form/fields/Field';
import MultiSelect from 'd2-angular/form/fields/MultiSelectBox';

describe('MultiSelect', () => {
    let selectField;
    let fieldOptions;

    it('should inherit from Field', () => {
        expect(new MultiSelect({fieldName: 'aggregationLevels'})).to.be.instanceof(Field);
    });

    describe('new MultiSelect()', () => {
        beforeEach(() => {
            fieldOptions = fixtures.get('modelValidations').aggregationLevels;
            fieldOptions.fieldName = 'aggregationLevels';

            selectField = new MultiSelect(fieldOptions);
        });

        it('should have the correct type', () => {
            expect(selectField.type).to.equal('multiselect');
        });
    });
});

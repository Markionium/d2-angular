'use strict';

import TextBox from 'd2-angular/form/fields/TextBox';

describe('TextBox', () => {
    let textField;
    let fieldOptions;

    beforeEach(() => {
        fieldOptions = {fieldName: 'firstName'};
    });

    describe('create method', () => {
        it('should return an instance of Field', () => {
            expect(TextBox.create(fieldOptions)).to.be.instanceof(TextBox);
        });
    });

    describe('new TextBox()', () => {
        beforeEach(() => {
            fieldOptions = fixtures.get('modelValidations').dimensionType;
            fieldOptions.fieldName = 'dimensionType';

            textField = new TextBox(fieldOptions);
        });

        it('should have the correct type', () => {
            expect(textField.type).to.equal('text');
        });
    });
});

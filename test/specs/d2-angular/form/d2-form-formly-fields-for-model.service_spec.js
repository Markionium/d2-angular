'use strict';

import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/form/d2-form.module';

import FormlyFieldsForModelService from 'd2-angular/form/d2-form-formly-fields-for-model.service';

describe('D2 Form: d2-formly-fields-for-model service', () => {
    const FIELDS_TO_IGNORE_ON_DISPLAY = ['id', 'publicAccess', 'created', 'lastUpdated', 'user', 'userGroupAccesses'];
    let modelMock;
    let service;

    beforeEach(() => {
        modelMock = {
            modelDefinition: {
                getOwnedPropertyNames: sinon.stub()
                    .returns([
                        'aggregationLevels', 'zeroIsSignificant', 'type',
                        'optionSet', 'id', 'created', 'description',
                        'commentOptionSet', 'name', 'textType',
                        'publicAccess', 'aggregationOperator',
                        'formName', 'lastUpdated', 'code', 'url',
                        'numberType', 'domainType', 'legendSet',
                        'categoryCombo', 'attributeValues',
                        'shortName', 'user'
                    ]),
                modelValidations: fixtures.get('modelValidations')
            },
            optionSet: {id: 'j2iyo9Das93', name: 'Yes No'}
        };

        service = new FormlyFieldsForModelService(FIELDS_TO_IGNORE_ON_DISPLAY);
    });

    it('should have a getFormlyFieldsForModel method', () => {
        expect(service.getFormlyFieldsForModel).to.be.instanceof(Function);
    });

    it('should return an array of formly fields', () => {
        expect(service.getFormlyFieldsForModel(modelMock)).to.be.instanceof(Array);
    });

    it('should throw an error when the modelValidations object is not available', () => {
        expect(() => service.getFormlyFieldsForModel()).to.throw('Passed model does not seem to adhere to ' +
            'the d2 model structure (model.modelDefinition.modelValidations is not available)');
    });

    it('should return the correct amount of fields', () => {
        expect(service.getFormlyFieldsForModel(modelMock).length).to.equal(15);
    });

    it('should return the fields in the formly structure', () => {
        let firstFormlyField = service.getFormlyFieldsForModel(modelMock)[0];
        let expectedTemplateOptions = {
            label: 'zeroIsSignificant',
            required: true
        };

        expect(firstFormlyField.key).to.equal('zeroIsSignificant');
        expect(firstFormlyField.type).to.equal('checkbox');
        expect(firstFormlyField.templateOptions).to.deep.equal(expectedTemplateOptions);
    });
});

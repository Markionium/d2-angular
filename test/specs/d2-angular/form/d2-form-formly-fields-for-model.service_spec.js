'use strict';

import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/form/d2-form.module';

import FormlyFieldsForModelService from 'd2-angular/form/d2-form-formly-fields-for-model.service';

import {SELECT} from 'd2-angular/form/fields/fields';
import InputBox from 'd2-angular/form/fields/InputBox';
import SelectBox from 'd2-angular/form/fields/SelectBox';

describe('D2 Form: d2-formly-fields-for-model service', () => {
    const FIELDS_TO_IGNORE_ON_DISPLAY = ['id', 'publicAccess', 'created', 'lastUpdated', 'user', 'userGroupAccesses'];
    let modelMock;
    let service;
    let modelsMock;

    beforeEach(() => {
        let modelDefinition = {
            list: sinon.stub().returns(new Promise(function (resolve, reject) {
                resolve([]);
            }))
        };
        modelsMock = {
            optionSet: modelDefinition,
            legendSet: modelDefinition,
            categoryCombo: modelDefinition,
            user: modelDefinition
        };
        modelMock = {
            modelDefinition: {
                modelValidations: fixtures.get('modelValidations')
            }
        };

        service = new FormlyFieldsForModelService(FIELDS_TO_IGNORE_ON_DISPLAY, modelsMock);
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
        expect(service.getFormlyFieldsForModel(modelMock).length).to.equal(17);
    });

    it('should return the fields in the formly structure', () => {
        let firstFormlyField = service.getFormlyFieldsForModel(modelMock)[0];

        expect(firstFormlyField.key).to.equal('aggregationLevels');
        expect(firstFormlyField.type).to.equal('multiselect');
    });

    it('should return the correct templateOptions', () => {
        let firstFormlyField = service.getFormlyFieldsForModel(modelMock)[0];

        expect(firstFormlyField.templateOptions.label).to.equal('aggregation_levels');
        expect(firstFormlyField.templateOptions.required).to.equal(false);
    });

    it('should set the minLength property', () => {
        let firstFormlyField = service.getFormlyFieldsForModel(modelMock)[0];

        expect(firstFormlyField.templateOptions.minLength).to.equal(-2147483648);
    });

    it('should set the maxLength property', () => {
        let firstFormlyField = service.getFormlyFieldsForModel(modelMock)[0];

        expect(firstFormlyField.templateOptions.maxLength).to.equal(2147483647);
    });

    describe('field order', () => {
        let formlyFields;

        beforeEach(() => {
            service.setDefaultFieldOrder(['name', 'shortName', 'code']);
            formlyFields = service.getFormlyFieldsForModel(modelMock);
        });

        it('should respect the set field order', () => {
            expect(formlyFields[0].key).to.equal('name');
            expect(formlyFields[1].key).to.equal('shortName');
            expect(formlyFields[2].key).to.equal('code');
        });

        it('should not remove any fields when an order is used', () => {
            let serviceWithoutOrder = new FormlyFieldsForModelService(FIELDS_TO_IGNORE_ON_DISPLAY, modelsMock);
            let formlyFieldsWithoutOrder = serviceWithoutOrder.getFormlyFieldsForModel(modelMock);

            expect(formlyFieldsWithoutOrder.length).to.equal(formlyFields.length);
        });
    });

    describe('field overrides', () => {
        let modelMock;
        let overrideConfig;

        beforeEach(() => {
            modelMock = {
                modelDefinition: {
                    modelValidations: {type: fixtures.get('modelValidations').type}
                }
            };

            service = new FormlyFieldsForModelService(FIELDS_TO_IGNORE_ON_DISPLAY, modelsMock);

            overrideConfig = {
                type: {
                    type: SELECT,
                    templateOptions: {
                        options: ['int', 'string', 'boolean']
                    }
                }
            };
        });

        it('should return the field without override', () => {
            let formlyFields = service.getFormlyFieldsForModel(modelMock);

            expect(formlyFields[0].key).to.equal('type');
            expect(formlyFields[0]).to.be.instanceof(InputBox);
        });

        it('should return the correct overriden field', () => {
            let formlyFields = service.getFormlyFieldsForModel(modelMock, overrideConfig);
            let expectedOptions = [
                {name: 'int', value: 'int'},
                {name: 'string', value: 'string'},
                {name: 'boolean', value: 'boolean'}
            ];

            expect(formlyFields[0].key).to.equal('type');
            expect(formlyFields[0]).to.be.instanceof(SelectBox);
            expect(formlyFields[0].templateOptions.options).to.deep.equal(expectedOptions);
        });
    });
});

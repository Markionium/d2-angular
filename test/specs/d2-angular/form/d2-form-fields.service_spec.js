import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/form/d2-form.module';
import {D2FormFieldsManager} from 'd2-angular/form/d2-form-fields.service';

describe('D2 Form: d2FormFieldsManager', () => {
    let service;

    beforeEach(angular.mock.module('d2-angular.form', function ($provide) {
        let modelsMock = {
            optionSet: {
                list: sinon.stub()
            }
        };

        $provide.factory('models', function () {
            return modelsMock;
        });
    }));
    beforeEach(inject($injector => {
        service = $injector.get('d2FormFields');
    }));

    it('should be an object', () => {
        expect(service).to.be.instanceof(Object);
    });

    describe('getManager', () => {
        it('should return a D2FormFieldsManager instance', () => {
            expect(service.getManager()).to.be.instanceof(D2FormFieldsManager);
        });
    });
});

describe('D2FormFieldsManager', () => {
    let manager;

    beforeEach(() => {
        manager =  new D2FormFieldsManager();
    });

    it('should return the default fields to ignore', () => {
        expect(manager.getFieldNamesToIgnoreOnDisplay()).to.deep.equal(['id', 'publicAccess', 'created', 'lastUpdated', 'user']);
    });

    it('should return the default header fields', () => {
        expect(manager.getHeaderFieldNames()).to.deep.equal(['name', 'shortName', 'code']);
    });

    it('should return the typeMap', () => {
        let expectedTypeMap = {
            text: ['TEXT', 'IDENTIFIER'],
            select: ['CONSTANT'],
            reference: ['REFERENCE']
        };

        expect(manager.getTypeMap()).to.deep.equal(expectedTypeMap);
    });

    it('should return an object with templates', () => {
        expect(manager.getFieldTemplates()).to.be.instanceof(Object);
        expect(manager.getFieldTemplates().input).to.equal(
                   // FIXME: Equals of the string checks the whitespace so we need to have
                   // the same identation could probably do some sort of whitespace replace
                   `<input name="{{field.name}}"
                           type="{{field.type}}"
                           placeholder="{{field.placeholder}}"
                           ng-model="d2Form.model[field.property]"
                           ng-required="field.required"
                           ng-change="field.onChange(d2Form.model)"
                           />`);
    });

    describe('addFieldOverrideFor', () => {
        it('should add a field override for the given fieldname', () => {
            manager.addFieldOverrideFor('type', {type: 'text'});

            expect(manager.fieldOverrides['type']).to.deep.equal({type: 'text'});
        });

        it('should return an the manager for chaining', () => {
            expect(manager.addFieldOverrideFor('type', {type: 'text'})).to.equal(manager);
        });

        it('should transform an array of options to the required options array with objects', () => {
            let expectedOptions = [
                {value: 'int', name: 'int', id: 'int'},
                {},
                {}
            ]
            manager.addFieldOverrideFor('type', {
                type: 'select',
                options: ['int', 'string', 'boolean']
            });

            expect()
        });
    });
    
    describe('getFieldOverrideFor', () => {
        beforeEach(() => {
            manager.addFieldOverrideFor('aggregationOperator', {
                type: 'select'
            });
        });

        it('should return an override setting for a field', () => {
            expect(manager.getFieldOverrideFor('aggregationOperator')).to.deep.equal({type: 'select'});
        });
    });
});
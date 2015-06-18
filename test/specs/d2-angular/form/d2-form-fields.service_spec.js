import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/form/d2-form.module';
import D2FormFieldsManager from 'd2-angular/form/d2-form-field-manager';

describe('D2FormFieldsManager', () => {
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

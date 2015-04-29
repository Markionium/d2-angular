import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/form/d2-form.module';

import {D2FormFieldsManager} from 'd2-angular/form/d2-form-fields.service';

describe('D2 Form: d2-from-for-model directive', () => {
    let element;
    let scope;
    let controller;
    let isolatedScope;
    let modelsMock = {};

    beforeEach(angular.mock.module('d2-angular.form', ($provide) => {
        $provide.factory('d2FormFields', () => {
            return {
                getManager: () => new D2FormFieldsManager()
            };
        });

        $provide.factory('models', function ($q) {
            return modelsMock;
        });
    }));
    beforeEach(inject(function ($q) {
        modelsMock.optionSet = {
            list: sinon.stub()
                .returns($q.when([
                    {id: 'P5T6XLxAMuT', name: 'EA Point of Service'},
                    {id: 'iQVTOxirAMr', name: 'Priority Options'},
                    {id: 'NhBfT0hyniX', name: 'SIMS Score'},
                    {id: 'cJT5PIYlJJ2', name: 'SIMS Visit Type'},
                    {id: 'rEe8qYehRjk', name: 'SMS Performance'},
                    {id: 'nqlZCLapeAz', name: 'SMS Visit type'},
                    {id: 'Mi7e46Arz3f', name: 'SOP Eval Type'},
                    {id: 'B0l3k52TIfn', name: 'SOP Fiscal Year'},
                    {id: 'xk2QOngeISE', name: 'SOP YNDK'},
                    {id: 'w6CxWxQu8uA', name: 'SOP YNP'},
                    {id: 'sMrSJOCZ23C', name: 'Technical Areas'},
                    {id: 'rW8mXOUxQty', name: 'USG Agency'},
                    {id: 'j2iyo9Das93', name: 'Yes No'}
                ])
            )
        };
    }));
    beforeEach(inject(($compile, $rootScope, d2FormFields) => {
        element = angular.element(`
            <d2-form-for-model model="app.myModel" manager="app.formFieldsManager"></d2-form-for-model>
        `);

        scope = $rootScope.$new();
        scope.app = {
            myModel: {
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
                            'userGroupAccesses', 'shortName', 'user'
                        ]),
                    modelValidations: fixtures.get('modelValidations')
                },
                optionSet: {id: 'j2iyo9Das93', name: 'Yes No'}
            },
            formFieldsManager: d2FormFields.getManager()
        };

        scope.app.formFieldsManager.addFieldOverrideFor('aggregationOperator', {
            type: 'select'
        });

        element = $compile(element)(scope);
        scope.$digest();

        controller = element.controller('d2FormForModel');

        isolatedScope = element.isolateScope();
    }));

    it('should compile', () => {
        expect(element.children().length).to.equal(1);
    });

    describe('header fields', () => {
        let headerFieldsWrap;

        beforeEach(() => {
            headerFieldsWrap = element.children().find('.d2-form-fields-head');
        });

        it('should have container for the header fields', () => {
            expect(headerFieldsWrap.length).to.equal(1);
        });

        it('should have loaded two header fields', () => {
            expect(headerFieldsWrap.children().length).to.equal(3);
        });
    });

    describe('normal fields', () => {
        let mainFieldsWrap;

        beforeEach(() => {
            mainFieldsWrap = element.children().find('.d2-form-fields-main');
        });

        it('should have a container for the main fields', () => {
            expect(mainFieldsWrap.length).to.equal(1);
        });

        it('should have loaded seven main fields', () => {
            expect(mainFieldsWrap.children().length).to.equal(11);
        });
    });

    describe('fields manager', () => {
        it('should add a default manager if no manager is passed', inject(($compile, $rootScope) => {
            let app = scope.app;

            element = angular.element(`
                <d2-form-for-model model="app.myModel"></d2-form-for-model>
            `);

            scope = $rootScope.$new();
            scope.app = app;

            element = $compile(element)(scope);
            scope.$digest();
            controller = element.controller('d2FormForModel');

            expect(controller.formFieldsManager).to.be.instanceof(D2FormFieldsManager);
        }));

        it('should be the passed form field manager if one was provided', () => {
            expect(controller.formFieldsManager).to.equal(scope.app.formFieldsManager);
        });
    });

    describe('field override', () => {
        let mainFieldsWrap;

        beforeEach(() => {
            mainFieldsWrap = element.children().find('.d2-form-fields-main');
        });

        it('should correctly apply the type override for the default override description', () => {
            let descriptionField = mainFieldsWrap.find('[name=description]');

            expect(descriptionField[0].tagName).to.equal('TEXTAREA');
        });

        it('should correctly apply the type for a defined override', () => {
            let aggregationOperatorField = mainFieldsWrap.find('[name=aggregationOperator]');

            expect(aggregationOperatorField[0].tagName).to.equal('SELECT');
        });
    });

    describe('reference fields', () => {
        let mainFieldsWrap;

        beforeEach(() => {
            scope.$apply();
            mainFieldsWrap = element.children().find('.d2-form-fields-main');
        });

        it('should ask the api for the values of the field', () => {
            expect(modelsMock.optionSet.list).to.be.called;
        });

        it('should have loaded the requested values into the selectbox as options', (done) => {
            var optionSet;

            modelsMock.optionSet.list().then(function (data) {
                optionSet = element.children().find('.d2-form-fields-main').find('[name="optionSet"]');
                expect(optionSet.children().length).to.equal(13);
                done();
            });

            scope.$apply();
        });
    });
});

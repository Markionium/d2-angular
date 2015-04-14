import 'babel/browser-polyfill';

import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/select-from-list/select-from-list.module';

describe('D2 Select from list: Directive:', () => {
    let $rootScope;
    let $compile;
    let $q;
    let element;
    let controller;
    let scope;
    let availableDataItems;

    beforeEach(angular.mock.module('d2-angular.select-from-list'));
    beforeEach(inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');

        availableDataItems = [
            {id: 'umC9U5YGDq4', name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated'},
            {id: 'NYXJu5vwbhN', name: 'BS_COLL (N, DSD): Blood Units Donated'},
            {id: 'f2a9eOzfpR7', name: 'BS_COLL (N, DSD_NARRATIVE) TARGET: Blood Units Donated'},
            {id: 'Zh08CCOJSBD', name: 'BS_COLL (N, DSD_NARRATIVE): Blood Units Donated'}
        ];

        element = `<d2-select-from-list
                        available-source="availableSource"
                        ng-model="selectedItems">
                   </d2-select-from-list>`;

        scope = $rootScope.$new();
        scope.availableSource = $q.when(availableDataItems);
        scope.selectedItems = [];

        element = $compile(element)(scope);
        scope.$digest();

        controller = element.controller('selectFromList');
    }));

    it('should have the d2-select-from-list class', () => {
        expect(element.hasClass('d2-select-from-list')).to.be.true;
    });

    describe('basic structure', () => {
        it('should have select lists for available/selected items', () => {
            expect(element.find('div.available select').length).to.equal(1);
            expect(element.find('div.selected select ').length).to.equal(1);
        });

        it('should have an ul lists for selected and available items', () => {
            expect(element.find('div.available ul').length).to.equal(1);
            expect(element.find('div.selected ul ').length).to.equal(1);
        });

        it('should hide the select elements', () => {
            expect(element.find('div.available select').hasClass('ng-hide')).to.be.true;
            expect(element.find('div.selected select ').hasClass('ng-hide')).to.be.true;
        });
    });

    describe('after loading values', () => {
        let availableSelectItems;
        let availableUlItems;

        beforeEach(() => {
            availableSelectItems = element.find('div.available select');
            availableUlItems = element.find('div.available ul');
        });

        it('should have added values to the available list', () => {
            expect(availableSelectItems.children('option').length).to.equal(4);
        });

        it('should have added the values to the ul available list', () => {
            expect(availableUlItems.children('li').length).to.equal(4);
        });
    });

    describe('with selected values', () => {
        let selectedSelectItems;
        let availableSelectItems;

        beforeEach(() => {
            selectedSelectItems = element.find('div.selected ul');

            scope.selectedItems = [availableDataItems[2]];
            scope.$apply();

            availableSelectItems = element.find('div.available select');

        });

        it('should display the available items in the selected list', () => {
            expect(selectedSelectItems.children('li').length).to.equal(1);
        });

        it('should not show the item in the available items list', () => {
            expect(availableSelectItems.children('option').length).to.equal(3);
        });

        it('should move a value to the other list when double clicked', () => {
            let firstDataElement = element.find('div.selected li').first();

            firstDataElement.dblclick();
            scope.$apply();

            expect(availableSelectItems.children('option').length).to.equal(3);
            expect(scope.selectedItems.length).to.equal(1);
        });
    });
});

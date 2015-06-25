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

        controller = element.controller('d2SelectFromList');
        element = element.children().first();
    }));

    it('should have the d2-select-from-list class', () => {
        expect(element.hasClass('d2-select-from-list')).to.be.true;
    });

    describe('basic structure', () => {
        it('should have an ul lists for selected and available items', () => {
            expect(element.find('div.available ul').length).to.equal(1);
            expect(element.find('div.selected ul ').length).to.equal(1);
        });
    });

    describe('after loading values', () => {
        let availableSelectItems;
        let availableUlItems;

        beforeEach(() => {
            availableSelectItems = element.find('div.available select');
            availableUlItems = element.find('div.available ul');
            $rootScope.$apply();
        });

        it('should have added values to the available list', () => {
            expect(controller.availableList.length).to.equal(4);
        });

        it('should have added the values to the ul available list', () => {
            expect(availableUlItems.children('li').length).to.equal(4);
        });
    });

    describe('with selected values', () => {
        let selectedSelectItems;
        let availableSelectItems;

        beforeEach(() => {
            scope.selectedItems = [availableDataItems[2]];
            scope.$apply();

            selectedSelectItems = element.find('div.selected ul');
            availableSelectItems = element.find('div.available ul');

        });

        it('should display the available items in the selected list', () => {
            expect(selectedSelectItems.children('li').length).to.equal(1);
        });

        it('should not show the item in the available items list', () => {
            expect(availableSelectItems.children('li').length).to.equal(3);
        });

        it('should move a value to the other list when double clicked', () => {
            let firstDataElement = element.find('div.available li').first();

            firstDataElement.dblclick();
            scope.$apply();

            expect(availableSelectItems.children('li').length).to.equal(2);
            expect(selectedSelectItems.children('li').length).to.equal(2);
        });

        it('should move a selected item back to the available list', () => {
            let firstDataElement = element.find('div.selected li').first();

            firstDataElement.dblclick();
            scope.$apply();

            expect(availableSelectItems.children('li').length).to.equal(4);
            expect(scope.selectedItems.length).to.equal(0);
        });
    });

    describe('selecting available items', () => {
        let firstDataElement;

        beforeEach(() => {
            firstDataElement = element.find('div.available li').first();
        });

        it('should add the clicked available items id to the availableSelectedList', () => {
            firstDataElement.click();
            scope.$apply();

            expect(controller.availableSelected.has('umC9U5YGDq4')).to.be.true;
        });

        it('should remove the clicked available item from the availableSelectedList', () => {
            controller.availableSelected.add('umC9U5YGDq4');

            firstDataElement.click();
            scope.$apply();

            expect(controller.availableSelected.has('umC9U5YGDq4')).to.be.false;
        });

        it('should add a class to the li for the selected element', () => {
            let firstDataElement = element.find('div.available li').first();

            firstDataElement.click();
            scope.$apply();

            firstDataElement = element.find('div.available li').first();

            expect(firstDataElement.hasClass('d2-select-list-item-selected')).to.be.true;
        });

        it('should remove a class to the li for the selected element', () => {
            let firstDataElement = element.find('div.available li').first();
            controller.availableSelected.add('umC9U5YGDq4');

            firstDataElement.click();
            scope.$apply();

            firstDataElement = element.find('div.available li').first();
            expect(firstDataElement.hasClass('d2-select-list-item-selected')).to.be.false;
        });
    });

    describe('selecting selected items', () => {
        let firstDataElement;

        beforeEach(() => {
            scope.selectedItems = [availableDataItems[2]];
            scope.$apply();

            firstDataElement = element.find('div.selected li').first();
        });

        it('should add the clicked selected items id to the selectedSelectedList', () => {
            firstDataElement.click();
            scope.$apply();

            expect(controller.selectedSelected.has('f2a9eOzfpR7')).to.be.true;
        });

        it('should remove the clicked selected item from the selectedSelectedList', () => {
            controller.selectedSelected.add('f2a9eOzfpR7');

            firstDataElement.click();
            scope.$apply();

            expect(controller.selectedSelected.has('f2a9eOzfpR7')).to.be.false;
        });

        //TODO: add class checks
        //TODO: remove from selectedlists after double clicking
    });
});

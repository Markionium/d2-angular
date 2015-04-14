import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/table/d2-table.module';

describe('D2 Table: Pager directive', () => {
    let element;
    let scope;
    let isolatedScope;
    let controller;
    let mockObjectWithToArrayMethod;

    beforeEach(angular.mock.module('d2-angular.table'));
    beforeEach(inject(($compile, $rootScope) => {
        mockObjectWithToArrayMethod = {
            toArray() {
                return [];
            }
        };

        element = angular.element(`
            <d2-table column-names="tableOptions.columnNames"
                      table-data-source="tableOptions.source">
            </d2-table>
        `);

        scope = $rootScope.$new();
        scope.tableOptions  = {
            columnNames: ['uid', 'name', 'lastUpdated'],
            source: [
                {uid: 'a1', name: 'ANC', lastUpdated: 'Yesterday'},
                {uid: 'b1', name: 'BDC', lastUpdated: 'Tomorrow'},
                {uid: 'c1', name: 'BFG', lastUpdated: 'Today'}
            ]
        };

        $compile(element)(scope);
        scope.$digest();

        isolatedScope = element.scope();
        controller = element.controller('d2Table');
        controller.pager = {
            page:1,
            pageCount: 65,
            total: 3216,
            nextPage: 'http://localhost:8080/dhis/api/users?page=2',
            hasNextPage: function () {
                return true;
            },
            hasPreviousPage: function () {
                return false;
            }
        };
        scope.$apply();
    }));

    it('should have a pager element', function () {
        expect(element[0]).not.to.be.undefined;
    });

    describe('without pager', () => {
        beforeEach(() => {
            delete controller.pager;
            scope.$apply();

            element = element.find('.d2-table-pager');
        });

        it('should not have a pager tag', () => {
            expect(element[0]).to.be.undefined;
        });
    });

    describe('next button', () => {
        let nextButton;

        beforeEach(() => {
            nextButton = element[0].querySelector('.next-page');
        });

        it('should be shown', () => {
            expect(nextButton.classList.contains('ng-hide')).to.be.false;
        });

        it('should not be shown', () => {
            controller.pager.hasNextPage = function () {
                return false;
            };
            nextButton = element[0].querySelector('.next-page');
            scope.$apply();

            expect(nextButton.classList.contains('ng-hide')).to.be.true;
        });

        it('should call getNextPage on the pager when next page is clicked', () => {
            controller.pager.getNextPage = sinon.stub().returns(mockObjectWithToArrayMethod);

            nextButton.click();
            scope.$apply();

            expect(controller.pager.getNextPage).to.be.called;
        });
    });

    describe('previous button', () => {
        let previousButton;

        beforeEach(() => {
            previousButton = element[0].querySelector('.previous-page');
        });

        it('should not be shown', () => {
            expect(previousButton.classList.contains('ng-hide')).to.be.true;
        });

        it('should not be shown', () => {
            controller.pager.hasPreviousPage = function () {
                return true;
            };
            previousButton = element[0].querySelector('.previous-page');
            scope.$apply();

            expect(previousButton.classList.contains('ng-hide')).to.be.false;
        });

        it('should call getPreviousPage on the pager when next page is clicked', () => {
            controller.pager.getPreviousPage = sinon.stub().returns(mockObjectWithToArrayMethod);

            previousButton.click();
            scope.$apply();

            expect(controller.pager.getPreviousPage).to.be.called;
        });
    });

    describe('page information', () => {
        let pagingInformation;

        beforeEach(() => {
            pagingInformation = element.find('.pagination');
        });

        it('should have the pagination element', () => {
            expect(pagingInformation.length).to.equal(1);
        });

        it('should have a button for the first page', () => {
            expect(pagingInformation.children().first().children()[0].textContent).to.equal('1');
        });

        it('should have a button for the last page', () => {
            expect(pagingInformation.children().last().children()[0].textContent).to.equal('65');
        });

        it('should call the goToPage method on pager when a page number is called', () => {
            controller.pager.goToPage = sinon.stub().returns(mockObjectWithToArrayMethod);

            pagingInformation.children().last().children().click();

            expect(controller.pager.goToPage).to.be.calledWith(65);
        });
    });
});

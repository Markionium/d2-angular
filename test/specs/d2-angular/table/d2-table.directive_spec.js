import angular from 'angular';
import 'angular-mocks';

import 'd2-angular/table/d2-table.module';

describe('D2 Table: Table directive', () => {
    let element;
    let scope;
    let controller;
    let isolatedScope;

    beforeEach(angular.mock.module('d2-angular.table'));
    beforeEach(inject(($compile, $rootScope) => {
        element = angular.element(`
            <d2-table column-names="tableOptions.columnNames"
                      table-data-source="tableOptions.source">
                <div id="transcludedContent"></div>
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

        controller = element.controller('d2Table');

        isolatedScope = element.isolateScope();
    }));

    it('should have be a table element', () => {
        expect(element[0].classList.contains('d2-table')).to.be.true;
    });

    describe('controller', () => {
        it('should have an array of column names', () => {
            expect(controller.columnNames).to.deep.equal(['uid', 'name', 'lastUpdated']);
        });

        it('should transform a columnName into a readable header fieldname', () => {
            expect(controller.getHeaderName('lastUpdated')).to.equal('Last Updated');
        });

        it('should have a property for rows that is empty', () => {
            expect(controller.rows).to.be.an('array');
        });

        it('should have set the sourcePromise', () => {
            expect(controller.sourcePromise.then).to.not.be.undefined;
        });

        it('should resolve a promise and add the new data to rows', inject(($q) => {
            let newData = [
                {uid: 'b1', name: 'BDC', lastUpdated: 'Tomorrow'},
                {uid: 'f1', name: 'BFG', lastUpdated: 'Last year'},
                {uid: 'c1', name: 'BFG', lastUpdated: 'Today'}
            ];

            scope.tableOptions.source = $q.when(newData);
            scope.$apply();

            expect(controller.rows).to.deep.equal(newData);
        }));

        describe('loading flag', () => {
            var resolveDataSource;
            var rejectDataSource;
            var asyncDataSource;

            beforeEach(inject(($q) => {
                asyncDataSource = $q(function (resolve, reject) {
                    resolveDataSource = resolve;
                    rejectDataSource = reject;
                });

                scope.tableOptions.source = asyncDataSource;
                scope.$apply();
            }));

            it('should be set to true when a new source is set', () => {

                expect(controller.isLoading).to.be.true;
            });

            it('should be set to false after the data has been retrieved', () => {
                resolveDataSource([]);
                scope.$apply();

                expect(controller.isLoading).to.be.false;
            });

            it('should be set to false after the request for data errored', () => {
                rejectDataSource([]);
                scope.$apply();

                expect(controller.isLoading).to.be.false;
            });
        });
    });

    describe('table header', () => {
        let headerElement;

        beforeEach(() => {
            headerElement = element.find('thead');
        });

        it('should only have one row', () => {
            expect(headerElement.children().length).to.equal(1);
        });

        it('should display correct number of columns', () => {
            expect(headerElement.children().children().length).to.equal(3);
        });

        it('should display the correct column names', () => {
            let thElements = headerElement.children().children();

            expect(thElements[0].textContent).to.equal('Uid');
            expect(thElements[1].textContent).to.equal('Name');
            expect(thElements[2].textContent).to.equal('Last Updated');
        });
    });

    describe('data rows', () => {
        let tableBodyElement;

        beforeEach(() => {
            tableBodyElement = element.find('tbody');
        });

        it('should have one table row for each of the data rows', () => {
            expect(tableBodyElement.children().length).to.equal(controller.rows.length);
        });

        describe('single row', () => {
            let firstDataRow;

            beforeEach(() => {
                firstDataRow = angular.element(tableBodyElement.children()[0]);
            });

            it('should have the same amount of fields like the number of columns', () => {
                expect(firstDataRow.children().length).to.equal(3);
            });

            it('should have the right data values', () => {
                expect(firstDataRow.children()[0].textContent).to.equal('a1');
                expect(firstDataRow.children()[1].textContent).to.equal('ANC');
                expect(firstDataRow.children()[2].textContent).to.equal('Yesterday');
            });

            it('should update the data values when the source changes', inject(($q) => {
                let newData = [
                    {uid: 'b1', name: 'BDC', lastUpdated: 'Tomorrow'},
                    {uid: 'f1', name: 'BFG', lastUpdated: 'Last year'},
                    {uid: 'c1', name: 'BFG', lastUpdated: 'Today'}
                ];

                scope.tableOptions.source = $q.when(newData);
                scope.$apply();

                firstDataRow = angular.element(tableBodyElement.children()[0]);
                expect(firstDataRow.children()[0].textContent).to.equal('b1');
                expect(firstDataRow.children()[1].textContent).to.equal('BDC');
                expect(firstDataRow.children()[2].textContent).to.equal('Tomorrow');
            }));
        });
    });

    describe('when row clicked', () => {
        let firstDataRow;

        beforeEach(function () {
            let tableBodyElement = element.find('tbody');
            firstDataRow = angular.element(tableBodyElement.children()[0]);
        });

        it('should fire the rowClicked event', () => {
            let eventCallBack = sinon.spy();

            controller.onSelected(eventCallBack);

            firstDataRow.click();
            isolatedScope.$apply();

            expect(eventCallBack).to.be.called;
        });

        it('should pass the model to the rowClicked event', (done) => {
            controller.onSelected(function ($event, data) {
                expect(data).to.equal(scope.tableOptions.source[0]);
                done();
            });

            firstDataRow.click();
            isolatedScope.$apply();
        });

        it('should pass the event to the onSelected callbacks', (done) => {
            controller.onSelected(function ($event) {
                expect($event).not.to.be.undefined;
                expect($event.type).to.equal('click');
                done();
            });

            firstDataRow.click();
            isolatedScope.$apply();
        });

        it('should set the passed model as the current selected row', (done) => {
            controller.onSelected(function ($event, model) {
                expect(model).to.equal(controller.selected);
                done();
            });

            firstDataRow.click();
            isolatedScope.$apply();
        });
    });

    describe('transclusion', () => {
        it('should transclude the context menu into the html result', () => {
            expect(element.find('#transcludedContent')[0]).to.not.be.undefined;
        });
    });
});

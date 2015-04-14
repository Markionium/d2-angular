import angular from 'angular';
import 'angular-mocks';

describe('D2 Table: Context menu directive', () => {
    let controller;
    let element;
    let scope;

    beforeEach(angular.mock.module('d2-angular.table'));
    beforeEach(inject(($injector) => {
        let $compile = $injector.get('$compile');
        let $rootScope = $injector.get('$rootScope');

        element = `<d2-table d2-table-context-menu>
            <div class="context-menu" ng-show="contextMenu.isVisible()">

            </div>
        </d2-table>`;

        scope = $rootScope.$new();

        element = $compile(element)(scope);
        scope.$digest();

        controller = element.controller('d2Table');
    }));

    it('should compile', () => {
        expect(element.find('.context-menu').hasClass('context-menu')).to.be.true;
    });

    it('should be hidden on initialise', () => {
        expect(element.find('.context-menu').hasClass('ng-hide')).to.be.true;
    });

    it('should be shown after a model is set', () => {
        controller.selected = {name: 'Mark'};

        controller.selectionChanged({type: 'click'});
        scope.$apply();

        expect(element.find('.context-menu').hasClass('ng-hide')).to.be.false;
    });

    it('should set the received model onto the contextMenu', () => {
        controller.selected = {name: 'Mark'};

        controller.selectionChanged({type: 'click'});
        scope.$apply();

        expect(scope.contextMenu.model).to.equal(controller.selected);
    });

    it('should set the left and top properties of the context menu', () => {
        controller.selected = {name: 'Mark'};

        controller.selectionChanged({type: 'click', clientY: 100, clientX: 200});
        scope.$apply();

        expect(element.find('.context-menu')[0].style.top).to.equal('100px');
        expect(element.find('.context-menu')[0].style.left).to.equal('200px');
    });
});

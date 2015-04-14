function d2TablePagerDirective() {
    return {
        restict: 'E',
        require: '^d2Table',
        template: `
            <div class="d2-table-pager" ng-if="tableCtrl.pager">
                <button class="previous-page"
                        ng-show="tableCtrl.pager.hasPreviousPage()"
                        ng-click="getPreviousPageClick()">
                    <i class="fa fa-chevron-left"></i>
                </button>
                <ul class="pagination">
                    <li ng-repeat="page in pagination"
                        ng-class="{'active': page.active, 'separator': page.separator}"
                        ng-click="goToPageClick(page.pageNr)">
                        <span ng-if="page.separator" ng-bind="page.separator"></span>
                        <span class="page-button" ng-if="page.pageNr" ng-bind="page.pageNr"></span>
                    </li>
                </ul>
                <button class="next-page" ng-show="tableCtrl.pager.hasNextPage()" ng-click="getNextPageClick()">
                    <i class="fa fa-chevron-right"></i>
                </button>
            </div>
        `,
        controllerAs: 'tableCtrl',
        link: function (scope, element, attr, controller) {
            scope.getNextPageClick = function () {
                controller.tableDataSource = controller.pager.getNextPage();
                controller.initialise();
            };

            scope.getPreviousPageClick = function () {
                controller.tableDataSource = controller.pager.getPreviousPage();
                controller.initialise();
            };

            scope.goToPageClick = function (pageNr) {
                controller.tableDataSource = controller.pager.goToPage(pageNr);
                controller.initialise();
            };

            scope.$watch(function () {
                return controller.pager;
            }, function (newVal, oldVal) {
                if (!controller.pager || newVal === oldVal) {return;}

                scope.pagination = generatePagesBasedOfPager(controller.pager);
            });

            function generatePagesBasedOfPager(pager) {
                let pages = [];

                if (pager.page >= 3) {
                    pages.push({pageNr: 1, active: false});

                    if (pager.page > 3) {
                        pages.push({separator: '...'});
                    }
                }

                for (let i = pager.page - 1; i < pager.page + 2 && i <= pager.pageCount; i += 1) {
                    if (i > 0) {
                        pages.push({pageNr: i, active: pager.page === i ? true : false});
                    }
                }

                if (pager.page <= pager.pageCount - 2) {
                    if (pager.page !== pager.pageCount - 2) {
                        pages.push({separator: '...'});
                    }
                    pages.push({pageNr: pager.pageCount, active: false});
                }

                return pages;
            }
        }
    };
}

export default d2TablePagerDirective;

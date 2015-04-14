function d2TableDirective($q) {
    class D2TableDirectiveController {
        constructor() {
            this.isLoading = false;
            this.tableDataSource;
            this.sourcePromise;
            this.columnNames;
            this.rows = [];
            this.selected;
            this.onSelectedCallBacks = [];

            this.initialise();
        }

        initialise() {
            this.isLoading = true;
            this.sourcePromise = $q.when(this.tableDataSource);
            this.updateRows();
        }

        getHeaderName(columnName) {
            return columnName.replace(/([A-Z])/, ($0) => ' ' + $0).replace(/^(.)/, ($0) => $0.toUpperCase());
        }

        updateRows() {
            this.sourcePromise
                .then((data) => {
                    if (data && data.pager) {
                        this.pager = data.pager;
                    }
                    if (data && data.toArray) {
                        data = data.toArray();
                    }
                    this.rows = data || [];
                })
                .finally(() => this.isLoading = false);
        }

        onSelected(callBack) {
            this.onSelectedCallBacks.push(callBack);
        }

        selectionChanged($event) {
            if (!this.selected) { return; }

            this.onSelectedCallBacks.forEach((callback) => {
                callback.apply(null, [$event, this.selected]);
            });
        }
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            columnNames: '=',
            tableDataSource: '='
        },
        template: `
            <div class="d2-table">
                <div class="mask">
                    <div ng-show="tableCtrl.isLoading" layout="row" layout-sm="column" layout-align="space-around">
                        Loading...
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th ng-repeat="columnName in tableCtrl.columnNames"
                                ng-bind="tableCtrl.getHeaderName(columnName)">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="row in tableCtrl.rows"
                            ng-click="rowClick($event, row)"
                            class="d2-table-row">
                            <td data-title="{{::tableCtrl.getHeaderName(columnName)}}"
                                ng-repeat="columnName in ::tableCtrl.columnNames"
                                ng-bind="::row[columnName]">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <d2-table-pager></d2-table-pager>
                <ng-transclude></ng-transclude>
            </div>
        `,
        transclude: true,
        controller: D2TableDirectiveController,
        controllerAs: 'tableCtrl',
        bindToController: true,
        link: ($scope, element, attr, controller) => {
            $scope.$watch('tableCtrl.tableDataSource', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    controller.initialise();
                }
            });

            $scope.rowClick = function ($event, model) {
                controller.selected = model;
                controller.selectionChanged($event);
            };
        }
    };
}

export default d2TableDirective;

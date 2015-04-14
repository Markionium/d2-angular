import angular from 'angular';

function selectFromListDirective($q) {
    class SelectFromListController {
        constructor() {
            this.availableValues = [];
            this.selectedListModel;

            this.initSource(this.availableSource);
        }

        setSelectedListModel(selectedListModel) {
            this.selectedListModel = selectedListModel;
        }

        addSelectedItem(item) {
            let selectedList = [].concat(this.selectedListModel.$modelValue);
            selectedList.push(item);
            selectedList.sort((a, b) => a.name.localeCompare(b.name));

            this.selectedListModel.$setViewValue(selectedList);
            this.selectedListModel.$render();
        }

        updateAvailableList() {
            let selectedListIds = (this.selectedValues || []).map(item => item.id);

            this.availableValues = this.availableValues
                .filter(value => !selectedListIds.includes(value.id));
        }

        initSource(dataSource) {
            if (!dataSource) {return;}

            $q.when(dataSource)
                .then((data) => {
                    if (data && data.toArray) {
                        data = data.toArray();
                    }

                    this.availableValues = data || [];
                    this.updateAvailableList();
                });
        }

        static getTemplate() {
            return `
                <div class="d2-select-from-list">
                    <div class="available">
                        <ul>
                            <li
                                ng-repeat="availableValue in selectFromListCtrl.availableValues"
                                ng-bind="::availableValue.name"
                                ng-value="::availableValue.id"
                                ng-dblclick="selectFromListCtrl.addSelectedItem(availableValue)">
                            </li>
                        </ul>
                        <select class="ng-hide">
                            <option
                                ng-repeat="availableValue in selectFromListCtrl.availableValues"
                                ng-bind="::availableValue.name"
                                ng-value="::availableValue.id">
                            </option>
                        </select>
                    </div>
                    <div class="selected">
                        <ul>
                            <li
                                ng-repeat="availableValue in selectFromListCtrl.selectedValues"
                                ng-bind="::availableValue.name"
                            ></li>
                        </ul>
                        <select class="ng-hide"></select>
                    </div>
                </div>
                `;
        }

        static postLink($scope, element, attr, controller) {
            let selectListController = $scope.selectFromListCtrl;
            let ngModelController = controller;

            //Register the selected list model onto the list controller
            selectListController.setSelectedListModel(ngModelController);

            $scope.$watch('selectFromListCtrl.availableSource', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    selectListController.initSource(newVal);
                }
            });

            ngModelController.$render = function () {
                selectListController.selectedValues = ngModelController.$modelValue;

                selectListController.updateAvailableList();
            };
        }
    }

    let directiveConfig = {
        replace: true,
        require: 'ngModel',
        template: SelectFromListController.getTemplate(),
        scope: {
            availableSource: '='
        },
        bindToController: true,
        controller: SelectFromListController,
        controllerAs: 'selectFromListCtrl',
        link: SelectFromListController.postLink
    };

    return directiveConfig;
}

export default selectFromListDirective;

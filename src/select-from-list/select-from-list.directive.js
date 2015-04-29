import angular from 'angular';

function selectFromListDirective($q) {
    class SelectFromListController {
        constructor() {
            this.availableValuesSelected = new Set();
            this.selectedValuesSelected = new Set();
            this.availableValues = [];
            this.selectedValues = [];
            this.selectedListModel;

            this.initSource(this.availableSource);

            this.sortByName = (a, b) => a.name.localeCompare(b.name);
        }

        setSelectedListModel(selectedListModel) {
            this.selectedListModel = selectedListModel;
        }

        addSelectedItem(item) {
            let selectedList = [].concat(this.selectedListModel.$modelValue);
            selectedList.push(item);
            selectedList.sort(this.sortByName);

            this.renderSelectedList(selectedList);
        }

        removeSelectedItem(item) {
            let selectedList = [].concat(this.selectedListModel.$modelValue);
            selectedList = selectedList.filter(value => item.name !== value.name);

            this.availableValues.push(item);
            this.availableValues.sort(this.sortByName);

            this.renderSelectedList(selectedList);
        }

        renderSelectedList(selectedList) {
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

        toggleSelect(listName, availableValue) {
            let list = this[listName + 'ValuesSelected'];

            if (availableValue && list) {
                if (!list.has(availableValue.id)) {
                    list.add(availableValue.id);
                } else {
                    list.delete(availableValue.id);
                }
            }

            this.cleanUpSelectedList(listName, list);
            return this;
        }

        cleanUpSelectedList(listName, list) {
            let valuesList = this[listName + 'Values'];
            if (valuesList) {
                let valueKeys = new Set(valuesList.map(value => value.id));

                Array.from(list)
                    .forEach((value) => {
                        if (!valueKeys.has(value)) {
                            list.delete(value);
                        }
                    });
            }
        }

        isSelectedIn(listName, availableValue) {
            let list = this[listName + 'ValuesSelected'];

            if (availableValue && list && list.has(availableValue.id)) {
                return true;
            }
            return false;
        }

        static getTemplate() {
            return `
                <div class="d2-select-from-list">
                    <div class="available">
                        <header class="d2-color-primary">Available</header>
                        <ul d2-droppable="d2-select-list-item"
                            d2-on-drop="onDropAvailable($event, $data)"
                            class="selected-list-target">
                            <li class="d2-select-list-item"
                                d2-draggable="::availableValue"
                                d2-drop-target=".available-list-target"
                                d2-drag-data="::availableValue"

                                ng-repeat="availableValue in selectFromListCtrl.availableValues"
                                ng-bind="::availableValue.name"
                                ng-value="::availableValue.id"
                                ng-dblclick="selectFromListCtrl.addSelectedItem(availableValue)"
                                ng-click="selectFromListCtrl.toggleSelect('available', availableValue)"
                                ng-class="{
                                    'd2-select-list-item-selected': selectFromListCtrl.isSelectedIn(
                                        'available', availableValue
                                    )
                                }">
                            </li>
                        </ul>
                        <select multiple class="ng-hide">
                            <option
                                ng-repeat="availableValue in selectFromListCtrl.availableValues"
                                ng-value="::availableValue.id">
                            </option>
                        </select>
                    </div>
                    <div class="actions">
                        <d2-select-from-list-actions></d2-select-from-list-actions>
                    </div>
                    <div class="selected">
                        <header class="d2-color-primary">Selected</header>
                        <ul d2-droppable="d2-select-list-item"
                            d2-on-drop="onDropSelected($event, $data)"
                            class="available-list-target">
                            <li d2-draggable="::selectedValue"
                                d2-drop-target=".selected-list-target"
                                d2-drag-data="::selectedValue"

                                ng-repeat="selectedValue in selectFromListCtrl.selectedValues"
                                ng-bind="::selectedValue.name"
                                ng-dblclick="selectFromListCtrl.removeSelectedItem(selectedValue)"
                                ng-click="selectFromListCtrl.toggleSelect('selected', selectedValue)"
                                ng-class="{
                                    'd2-select-list-item-selected': selectFromListCtrl.isSelectedIn(
                                        'selected', selectedValue
                                    )
                                }">
                            </li>
                        </ul>
                        <select multiple class="ng-hide">
                            <option
                                ng-repeat="selectedValue in selectFromListCtrl.selectedValues"
                                ng-value="::selectedValue.id">
                            </option>
                        </select>
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

            $scope.onDropSelected = function ($event, modelValues) {
                let hasAvailableValue = $scope.selectFromListCtrl.availableValues
                    .some(value => value.id === modelValues.id);

                if (hasAvailableValue) {
                    $scope.selectFromListCtrl.addSelectedItem(modelValues);
                }
            };

            $scope.onDropAvailable = function ($event, modelValues) {
                let hasSelectedValue = $scope.selectFromListCtrl.selectedListModel.$modelValue
                    .some(value => value.id === modelValues.id);

                if (hasSelectedValue) {
                    $scope.selectFromListCtrl.removeSelectedItem(modelValues);
                }
            };

            ngModelController.$render = function () {
                selectListController.selectedValues = ngModelController.$modelValue;

                selectListController.updateAvailableList();
            };

            //Scroll mechanism as long as there are pages in the collection
            (function () {
                let isLoading = false;

                //When initial load is resolved check if we have more pages
                $scope.selectFromListCtrl.availableSource.then(function (collection) {
                    attachHandlerIfThereIsANextPage(collection);
                });

                function attachHandlerIfThereIsANextPage(collection) {
                    if (collection && collection.pager && collection.pager.hasNextPage()) {
                        element.find('div.available ul').on('scroll', loadMoreData);
                    }
                    return collection;

                    function loadMoreData(event) {
                        //jshint validthis:true
                        if (this.scrollTop + this.offsetHeight + 25 > this.scrollHeight) {
                            if (!isLoading) {
                                isLoading = true;

                                //Detach handler
                                element.find('div.available ul').off('scroll', loadMoreData);

                                collection.pager.getNextPage()
                                    .then(attachHandlerIfThereIsANextPage)
                                    .then(collection => collection.toArray())
                                    .then(models => {
                                        $scope.$apply(() => {
                                            $scope.selectFromListCtrl.availableValues =
                                                $scope.selectFromListCtrl.availableValues.concat(models);
                                        });
                                        isLoading = false;
                                    });
                            }
                        }
                    }
                }
            })();
        }
    }

    let directiveConfig = {
        replace: true,
        priority: 1,
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

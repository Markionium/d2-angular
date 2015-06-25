'use strict';

import angular from 'angular';

export function d2MaskDirective() {
    let directiveDefinition = {
        restrict: 'E',
        template: `
            <div class="d2-mask" ng-if="mask.isVisible">
                <ng-transclude></ng-transclude>
            </div>`,
        controller: class {},
        controllerAs: 'mask',
        bindToController: {
            isVisible: '='
        },
        scope: true,
        transclude: true
    };

    return directiveDefinition;
}

//TODO: No unit tests :(
//TODO: Should cancel old request
export function d2SelectFromListSearchFilterDirective($q, $parse) {
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    let directiveDefinition = {
        require: '^d2SelectFromList',
        link: function (scope, element, attr, selectFromListController) {
            //Add class to parent element of the list
            element.children().first().addClass('d2-select-from-list-search');

            let searchFilterPlaceHolder = attr.d2SelectFromListSearchFilter;
            let previousValue;
            let debouncedKeyUp = debounce(function (event) {
                let modelDefinition = selectFromListController.modelInfo && selectFromListController.modelInfo.modelDefinition;
                let searchValue = angular.element(event.target).val().trim();

                if (modelDefinition && (previousValue !== searchValue)) {
                    previousValue = searchValue;

                    //If no searchValue was found reset the filter
                    if (!searchValue) {
                        scope.$apply(function() {
                            selectFromListController.nameFilter = undefined;
                            selectFromListController.filterSelectedFromAvailableList();
                        });
                    } else {
                        scope.$apply(() => selectFromListController.isLoading = true);
                        $q.when(modelDefinition.filter().on('name').like(searchValue).list({paging: false}))
                            .then((searchResultCollection) => {
                                selectFromListController.addToAvailableCache(searchResultCollection.toArray());
                                selectFromListController.nameFilter = searchValue;
                                selectFromListController.filterSelectedFromAvailableList();
                            })
                            .catch((error) => console.error && console.error(error))
                            .then(() => selectFromListController.isLoading = false);
                    }
                }
            }, 400);

            let searchBoxTemplate = angular.element(`
                <input
                    type="text"
                    placeholder="${searchFilterPlaceHolder}"
                    class="search"
                    >
            `);
            searchBoxTemplate.on('keyup', function (event) {
                debouncedKeyUp(event);
                //Prevent enter key from saving the form
                event.stopPropagation();
                return false;
            });

            angular.element(element[0].querySelector('header')).after(searchBoxTemplate);
        }
    };

    return directiveDefinition;
}

//TODO: No unit tests :(
export function d2SelectFromListInfiniteScrollDirective() {
    let directiveDefinition = {
        require: '^d2SelectFromList',
        link: function (scope, element, attr, selectFromListController) {
            scope.$watch(function () {
                return selectFromListController.modelInfo &&
                    selectFromListController.modelInfo.lastPager;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (selectFromListController.modelInfo.lastPager.hasNextPage()) {
                        attachHandler();
                    }
                }
            });

            function attachHandler() {
                element.find('ul').on('scroll', loadMoreData);
            }

            function loadMoreData() {
                //Only load data if we are within 10% of the end of the list
                if (this.scrollTop + this.offsetHeight + Math.floor(this.scrollHeight * 0.10) <= this.scrollHeight) {
                    return true;
                }
                element.find('ul').off('scroll', loadMoreData);
                selectFromListController.isLoading = true;
                selectFromListController.modelInfo.lastPager.getNextPage()
                    .then(function (newCollection) {
                        selectFromListController.initAvailableList(newCollection);
                    })
                    .catch((error) => console.error && console.error(error))
                    .then(() => selectFromListController.isLoading = false);
            }

        }
    };

    return directiveDefinition;
}

export function d2MultiSelectDirective($parse) {
    let directiveDefinition = {
        template: `
        <div ng-class="msl.listName">
            <header class="d2-color-primary">
                <span ng-bind="::msl.listName"></span>
                <span>(</span>
                <span> showing {{msl.listSource.length}} </span>
                <span ng-if="msl.totalCount">of {{msl.totalCount}}</span>
                <span>)</span>
            </header>
            <ul>
                <li
                    ng-repeat="item in msl.listSource track by item.id"
                    ng-dblclick="msl.doubleClicked(item)"
                    ng-click="msl.clicked(item)"
                    ng-bind="::item.name"
                    ng-class="{'d2-select-list-item-selected': msl.checkIsSelected(item)}"
                >
                </li>
            </ul>
        </div>
        `,
        controller: class {
            doubleClicked(item) {
                this.doubleClick({$item: item});
            }
            clicked(item) {
                this.singleClick({$item: item});
            }
            checkIsSelected(item) {
                return (this.isSelected && this.isSelected({$item: item})) || false;
            }
        },
        scope: true,
        controllerAs: 'msl',
        bindToController: {
            listName: '@',
            listSource: '=',
            doubleClick: '&',
            singleClick: '&',
            totalCount: '=',
            isSelected: '&'
        }
    };

    return directiveDefinition;
}

function d2SelectFromListDirective($q, $parse, $log) {
    let directiveDefinition = {
        priority: 1,
        require: 'ngModel',
        template: `
            <div class="d2-select-from-list">
                <d2-multi-select
                    list-name="available"
                    list-source="vm.availableList"
                    double-click="vm.addSelected($item)"
                    single-click="vm.selectAvailable($item)"
                    total-count="vm.modelInfo.lastPager.total - vm.selectedList.length"
                    d2-select-from-list-infinite-scroll
                    d2-select-from-list-search-filter="Search available values"
                    is-selected="vm.isSelectedIn('availableSelected', $item)">
                </d2-multi-select>
                <div class="actions">
                    <d2-select-from-list-actions></d2-select-from-list-actions>
                </div>
                <d2-multi-select
                    list-name="selected"
                    list-source="vm.selectedList"
                    double-click="vm.removeSelected($item)"
                    single-click="vm.selectSelected($item)"
                    total-count="vm.selectedList.length"
                    is-selected="vm.isSelectedIn('selectedSelected', $item)">
                </d2-multi-select>
                <d2-mask is-visible="vm.isLoading">
                    <div class="loader">
                      <svg class="circular">
                        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>
                      </svg>
                    </div>
                </d2-mask>
            </div>
        `,
        scope: false,
        bindToController: {

        },
        controllerAs: 'vm',
        controller: class {
            constructor($scope) {
                this.availableListCache = new Map();

                this.availableSelected = new Set();
                this.selectedSelected = new Set();

                this.availableList = [];
                this.selectedList = [];

                this.modelInfo = {};
                this.sortByName = (a, b) => a.name.localeCompare(b.name)

                this.isLoading = false;
                this.$apply = $scope.$apply;
            }

            selectSelected(items) {
                if (!Array.isArray(items)) {
                    items = [items];
                }

                this.toggleItemsInSelectedList('selectedSelected', items);
            }

            selectAvailable(items) {
                if (!Array.isArray(items)) {
                    items = [items];
                }

                this.toggleItemsInSelectedList('availableSelected', items);
            }

            isSelectedIn(listName, item) {
                return this[listName] && item && this[listName].has(item.id);
            }

            toggleItemsInSelectedList(listName, items) {
                if (!(this[listName] instanceof Set)) {
                    return;
                }

                items.forEach(item => {
                    if (this[listName].has(item.id)) {
                        this[listName].delete(item.id);
                    } else {
                        this[listName].add(item.id);
                    }
                });
            }

            addSelected(items) {
                if (!Array.isArray(items)) {
                    items = [items];
                }

                this.selectedList = this.selectedList.concat(items).sort(this.sortByName);

                this.availableSelected.clear();

                this.renderSelectedList();
            }

            removeSelected(items) {
                if (!Array.isArray(items)) {
                    items = [items];
                }

                this.addToAvailableCacheIfNew(items);

                let itemIds = items.map(item => item.id);
                this.selectedList = this.selectedList.filter(item => itemIds.indexOf(item.id) === -1);

                this.selectedSelected.clear();

                this.renderSelectedList();
            }

            addToAvailableCacheIfNew(items) {
                items.forEach(item => {
                    if (!this.availableListCache.has(item.id)) {
                        this.availableListCache.set(item.id, item);
                    }
                });
            }

            renderSelectedList() {
                this.selectedListModel.$setViewValue(this.selectedList);
                this.selectedListModel.$render();
                this.isLoading = false;
            }

            addToAvailableCache(newList) {
                this.addToAvailableCacheIfNew(newList);
            }

            extractModelInformation(availableSource) {
                if (Array.isArray(availableSource)) {
                    return availableSource;
                }

                //TODO: Check if the source is actually a ModelCollection (instead of assuming it is when not an array)
                if (!this.modelInfo.modelDefinition) {
                    this.modelInfo.modelDefinition = availableSource.modelDefinition;
                }
                if (availableSource.pager) {
                    this.modelInfo.lastPager = availableSource.pager;
                }

                return availableSource.toArray();
            }

            initAvailableList(availableSource) {
                if (!availableSource) {
                    throw new Error('d2-select from-list');
                }
                this.isLoading = true;

                return $q.when(availableSource)
                    .then(this.extractModelInformation.bind(this))
                    .then(this.addToAvailableCache.bind(this))
                    .then(this.filterSelectedFromAvailableList.bind(this))
                    .catch((error) => console.error && console.error(error))
                    .then(() => this.isLoading = false);
            }

            filterSelectedFromAvailableList() {
                let selectedIds = (this.selectedList || []).map(item => item.id);

                this.availableList = Array.from(this.availableListCache.values())
                    .filter(item => selectedIds.indexOf(item.id) === -1)
                    .filter(item => {
                        if (this.nameFilter) {
                            return item.name.toLowerCase().indexOf(this.nameFilter.toLowerCase()) !== -1;
                        }
                        return true;
                    });
                return this.availableList;
            }

            setSelectedListModel(selectedListModel) {
                this.selectedListModel = selectedListModel;
            }

            setSelectedList() {
                this.selectedList = this.selectedListModel.$modelValue || [];
                this.selectedList.sort(this.sortByName);
            }
        },
        link: function (scope, element, attr, ngModelController) {
            let selectFromListController = scope.vm;
            let availableSource = $parse(attr.availableSource)(scope);

            selectFromListController.initAvailableList(availableSource);
            selectFromListController.setSelectedListModel(ngModelController);

            ngModelController.$render = function(){
                selectFromListController.setSelectedList();
                selectFromListController.filterSelectedFromAvailableList();
            };
        }
    };

    return directiveDefinition;
}

export default d2SelectFromListDirective;

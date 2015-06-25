import angular from 'angular';

function d2SelectFromListActions($timeout) {
    return {
        restrict: 'E',
        require: '^d2SelectFromList',
        template: `
            <d2-button class="d2-fab" icon="angle-down"
                ng-click="actions.selectedAvailableToSelected($event)"></d2-button>
            <d2-button class="d2-fab" icon="angle-up"
                ng-click="actions.selectedSelectedToAvailable($event)"></d2-button>
            <d2-button class="d2-fab" icon="angle-double-down" ng-click="actions.allToSelected($event)"></d2-button>
            <d2-button class="d2-fab" icon="angle-double-up" ng-click="actions.allToAvailable($event)"></d2-button>
        `,
        link: postLink
    };

    function postLink(scope, element, attr, selectFromListController) {
        scope.actions = {
            allToSelected: allToSelected,
            allToAvailable: allToAvailable,
            selectedAvailableToSelected: selectedAvailableToSelected,
            selectedSelectedToAvailable: selectedSelectedToAvailable
        };

        function allToSelected() {
            selectFromListController.isLoading = true;

            //Execute on the next cycle because it is potentially heavy
            $timeout(function () {
                selectFromListController.addSelected(selectFromListController.availableList);
            });
        }

        function allToAvailable() {
            selectFromListController.isLoading = true;

            //Execute on the next cycle because it is potentially heavy
            $timeout(function () {
                selectFromListController.removeSelected(selectFromListController.selectedList);
            });
        }

        function selectedAvailableToSelected() {
            let selectedItems = selectFromListController.availableList
                .filter(value => selectFromListController.availableSelected.has(value.id));

            selectFromListController.addSelected(selectedItems);
        }

        function selectedSelectedToAvailable() {
            let selectedItems = selectFromListController.selectedList
                .filter(value => selectFromListController.selectedSelected.has(value.id))

            selectFromListController.removeSelected(selectedItems);
        }
    }
}

export default d2SelectFromListActions;

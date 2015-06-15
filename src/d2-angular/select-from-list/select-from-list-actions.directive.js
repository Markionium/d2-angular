import angular from 'angular';

function d2SelectFromListActions($q) {
    return {
        restrict: 'E',
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

    function postLink($scope) {
        let selectListController = $scope.selectFromListCtrl;

        $scope.actions = {
            allToSelected: allToSelected,
            allToAvailable: allToAvailable,
            selectedAvailableToSelected: selectedAvailableToSelected,
            selectedSelectedToAvailable: selectedSelectedToAvailable
        };

        function allToSelected() {
            selectListController.availableValues.forEach(value => selectListController.addSelectedItem(value));
        }

        function allToAvailable() {
            selectListController.selectedValues.forEach(value => selectListController.removeSelectedItem(value));
        }

        function selectedAvailableToSelected() {
            selectListController.availableValues
                .filter(value => selectListController.availableValuesSelected.has(value.id))
                .forEach(value => selectListController.addSelectedItem(value));

            selectListController.availableValuesSelected.clear();
        }

        function selectedSelectedToAvailable() {
            selectListController.selectedValues
                .filter(value => selectListController.selectedValuesSelected.has(value.id))
                .forEach(value => selectListController.removeSelectedItem(value));

            selectListController.selectedValuesSelected.clear();
        }
    }
}

export default d2SelectFromListActions;

/* global angular */
function d2TableContextMenuDirective($location, DHIS2_BASEURL) {
    return {
        restrict: 'EA',
        require: 'd2Table',
        replace: true,
        scope: false,
        link: function (scope, element, attr, controller) {
            scope.contextMenu = {
                visibility: false,

                isVisible() {
                    return this.visibility;
                },

                setVisibility(isVisible) {
                    this.visibility = isVisible;
                },

                setModel(model) {
                    if (model === this.model) { return false; }
                    this.model = model;
                    this.setVisibility(true);
                },

                getBaseUrl() {
                    return DHIS2_BASEURL;
                },

                getModelName() {
                    if (this.model && this.model.modelDefinition) {
                        return this.model.modelDefinition.name.charAt(0).toUpperCase() +
                            this.model.modelDefinition.name.slice(1);
                    }
                },

                getReturnUrl() {
                    return $location.absUrl();
                }
            };

            let contextMenuElement = element.find('.context-menu')[0];

            controller.onSelected(function ($event, selectedRow) {
                scope.contextMenu.setModel(selectedRow);
                scope.contextMenu.setVisibility(true);

                contextMenuElement.style.top = ($event.clientY ? Number($event.clientY) : 0) + 'px';
                contextMenuElement.style.left = ($event.clientX ? Number($event.clientX) : 0) + 'px';
            });

            function hideContextMenu($event) {
                let rowElement = angular.element($event.target).parent()[0];

                if (rowElement && !rowElement.classList.contains('d2-table-row')) {
                    scope.$apply(function () {
                        scope.contextMenu.setVisibility(false);
                    });
                }
            }

            angular.element('html').on('click', hideContextMenu);

            element.find('.context-menu').on('$destroy', function () {
                angular.element('html').off('click', hideContextMenu);
            });
        }
    };
}

export default d2TableContextMenuDirective;

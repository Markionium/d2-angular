import angular from 'angular';

function draggable($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: postLink
    };

    function postLink($scope, element, attr) {
        if (!attr.d2Draggable) { return true; }
        let model = $parse(attr.d2Draggable)($scope);

        //Set the item to be draggable through the attribute
        if (!element.attr('draggable')) {
            element.attr('draggable', true);
        }

        element.on('dragstart', function (event) {
            let dataValues = $parse(attr.d2DragData)($scope);
            event.originalEvent.dataTransfer.setData('d2DragData', JSON.stringify(dataValues));

            toggleTargetMask(attr);
        });

        element.on('dragend', function () {
            toggleTargetMask(attr);
        });

        function toggleTargetMask(attr) {
            var targetElement = angular.element(attr.d2DropTarget);
            if (targetElement) {
                if (!targetElement.hasClass('d2-drop-target')) {
                    targetElement.addClass('d2-drop-target');
                } else {
                    targetElement.removeClass('d2-drop-target');
                }
            }
        }
    }
}

export default draggable;

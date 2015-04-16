function droppable($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: postLink
    };

    function postLink($scope, element, attr) {
        if (!attr.d2Droppable) { return true; }

        element.on('dragenter', cancel);
        element.on('dragover', cancel);
        element.on('drop', onDrop);

        function onDrop(event) {
            let data = {};

            //Extract the drag data from the event
            try {
                data = JSON.parse(event.originalEvent.dataTransfer.getData('d2DragData'));
                if (angular.isObject(data)) {
                    data = angular.extend({}, data);
                }
            } catch (e) {
                console.warn && console.warn('No data found on the drag event, therefore the d2-on-drop function will not be executed');
                return e;
            }

            $scope.$apply(function () {
                // Executes the call referenced in the d2-on-drop attribute
                // or a no-op function if there is no d2-on-drop.
                $parse(attr.d2OnDrop)($scope, {$event: event, $data: data});
            });
        }

        function cancel(event) {
            event.preventDefault();
            return false;
        }
    }
}

export default droppable;

import angular from 'angular';

import draggable from 'd2-angular/dragdrop/draggable.directive';
import droppable from 'd2-angular/dragdrop/droppable.directive';

angular.module('d2-angular.drag-drop', [])
    .directive('d2Draggable', draggable)
    .directive('d2Droppable', droppable);

export default angular.module('d2-angular.drag-drop');

'use strict';

import angular from 'angular';

function d2CheckboxDirective(animation) {
    return {
        restrict: 'EA',
        scope: {},
        require: 'ngModel',
        bindToController: {
            value: '=ngModel'
        },
        controllerAs: 'd2Cb',
        controller: class {},
        template: `
            <div>
                <input type="checkbox" ng-model="d2Cb.value">
                <i class="d2-checkbox fa"></i>
            </div>
        `,
        link: postLink
    };

    function postLink(scope, element) {
        element.on('mousedown', animation.get('ripple'));
    }
}

export default d2CheckboxDirective;

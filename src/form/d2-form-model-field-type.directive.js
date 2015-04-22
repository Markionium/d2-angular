export default function ($compile) {
    return {
        restrict: 'E',
        require: '^d2FormForModel',
        controllerAs: 'd2Form',
        bindToController: true,
        link: function (scope, element, attr, controller) {
            inputField(controller.getFieldTemplate(scope.field));

            function inputField(fieldTemplate) {
                let fieldTemplate = angular.element(fieldTemplate);

                element.append(fieldTemplate);
                $compile(fieldTemplate)(scope);
            }
        }
    };
}

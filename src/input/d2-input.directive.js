import angular from 'angular';

function d2InputDirective(INPUT_REQUIRED_ICON_CLASS) {
    return {
        restrict: 'EA',
        replace: true,
        template: getTemplate,
        transclude: true,
        link: postLink
    };

    function getTemplate() {
        return `<d2-input-wrap class="d2-input" ng-transclude></d2-input-wrap>`;
    }

    function postLink(scope, element) {
        let inputElement = getInputElement(element);
        setHasContentClassWhenInputHasContent(inputElement, element);

        inputElement.on('change', function (event) {
            let element = angular.element(event.target);
            setHasContentClassWhenInputHasContent(element, element.parent());
        });

        inputElement.on('focus', function (event) {
            angular.element(event.target.parentNode).addClass('d2-input-focused');
        });

        inputElement.on('blur', function (event) {
            angular.element(event.target.parentNode).removeClass('d2-input-focused');
        });

        if (inputElement.attr('required')) {
            element.find('label').append('<i class="' + INPUT_REQUIRED_ICON_CLASS + '"></i>');
        }
    }

    function getInputElement(element) {
        let inputElement = element[0] && element[0].querySelector('input');

        return angular.element(inputElement);
    }

    function setHasContentClassWhenInputHasContent(inputElement, element) {
        if (inputElement.val()) {
            element.addClass('d2-input-has-content');
        } else {
            element.removeClass('d2-input-has-content');
        }
    }
}

export default d2InputDirective;

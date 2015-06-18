import angular from 'angular';

function d2InputDirective(INPUT_REQUIRED_ICON_CLASS, $parse) {
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
        let labelElement = getLabelElement(element);

        element.addClass('d2-input-type-' + inputElement[0].tagName.toLowerCase());

        setHasContentClassWhenInputHasContent(inputElement, element);

        // TODO: We need two change handlers as one only watches the model and the other fires on the event
        // should see if we can remove the watcher and only use the handler.
        scope.$watch(() => inputElement.val(), (newVal, oldVal) => {
            if (newVal !== oldVal) {
                setHasContentClassWhenInputHasContent(inputElement, element);
            }
        });

        labelElement.on('click', (event) => {
            if (!inputElement.hasClass('d2-input-focused')) {
                inputElement.trigger('focus');
            }
        });

        inputElement.on('change', (event) => {
            setHasContentClassWhenInputHasContent(inputElement, element);
        });

        inputElement.on('focus', function (event) {
            angular.element(event.target.parentNode).addClass('d2-input-focused');
        });

        inputElement.on('blur', function (event) {
            angular.element(event.target.parentNode).removeClass('d2-input-focused');
        });
    }

    function getInputElement(element) {
        let inputElement = element[0] && element[0].querySelector('input');
        let textArea = element[0] && element[0].querySelector('textarea');
        let selectElement = element[0] && element[0].querySelector('select');
        return angular.element(inputElement || textArea || selectElement);
    }

    function getLabelElement(element) {
        let inputElement = element[0] && element[0].querySelector('label');

        return angular.element(inputElement);
    }

    function setHasContentClassWhenInputHasContent(inputElement, element) {
        if (inputElement.val() && inputElement.val() !== '?') {
            element.addClass('d2-input-has-content');
        } else {
            element.removeClass('d2-input-has-content');
        }
    }
}

export default d2InputDirective;

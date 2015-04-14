import angular from 'angular';

function d2ButtonDirective(animation) {
    return {
        restrict: 'EA',
        replace: true,
        template: getTemplate,
        transclude: true,
        link: postLink
    };

    function isAnchor(attr) {
        return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.uiSref);
    }

    function hasIcon(attr) {
        return angular.isDefined(attr.icon);
    }

    function getTemplate(element, attr) {
        let tagType = isAnchor(attr) ? 'a' : 'button';
        let innerTemplate = '<span ng-transclude></span>';

        if (hasIcon(attr)) {
            let icon = attr.icon;
            innerTemplate = `<i class="fa fa-${icon}"></i>` + innerTemplate;
        }

        return `<${tagType} class="d2-button">${innerTemplate}</${tagType}>`;
    }

    function postLink(scope, element) {
        element.on('mousedown', animation.get('ripple'));
    }
}

export default d2ButtonDirective;

import angular from 'angular';

export default function (d2FormFields, models, $log, $q) {
    class D2FormController {
        static postLink(scope, element, attr, controller) {
            controller.formFieldsManager = controller.manager ? controller.manager : d2FormFields.getManager();

            controller.headFormFields = controller.manager.getHeaderFieldsForModel(controller.model);
            controller.normalFormFields = controller.manager.getNonHeaderFieldsForModel(controller.model);
        }
    }

    return {
        restrict: 'E',
        scope: {},
        controller: D2FormController,
        bindToController: {
            model: '=',
            manager: '='
        },
        controllerAs: 'd2Form',
        template: `
            <form>
                <div class="d2-form-fields d2-form-fields-head">
                    <formly-form model="d2Form.model" fields="d2Form.headFormFields"></formly-form>
                </div>
                <div class="d2-form-fields">
                    <formly-form model="d2Form.model" fields="d2Form.normalFormFields"></formly-form>
                </div>
            </form>
       `,
        link: D2FormController.postLink
    };
}

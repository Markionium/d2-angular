export default function (d2FormFields, $log) {
    class D2FormController {
        getFieldConfig(propertyName) {
            let modelOptions = this.model.modelDefinition.modelValidations[propertyName];

            let fieldConfig = {
                name: propertyName,
                type: this.getType(modelOptions.type),
                placeholder: '',
                property: propertyName,
                isHeadField: this.formFieldsManager.getHeaderFieldNames().includes(propertyName),
                required: modelOptions.required,
                hideWhen: angular.noop,
                onChange: angular.noop
            };

            if (modelOptions.constants) {
                fieldConfig.options = modelOptions.constants;
            }

            return fieldConfig;
        }

        getType(typeFromModel) {
            const typeMap = this.formFieldsManager.getTypeMap();
            let inputType = undefined;

            Object.keys(typeMap)
                .forEach(function (typeMapKey) {
                    if (typeMap[typeMapKey].indexOf(typeFromModel) >= 0) {
                        inputType = typeMapKey;
                    }
                });

            return inputType;
        }

        applyTypeOverrides(fieldConfig) {
            if (fieldConfig.name === 'description') {
                fieldConfig.type = 'textarea';
            }
            return fieldConfig;
        }

        getFieldTemplate(field) {
            const templates = this.formFieldsManager.getFieldTemplates();

            //Extend the field with the overrides that might be present on the manager
            field = angular.extend(field, this.formFieldsManager.getFieldOverrideFor(field.name));

            switch (field.type) {
                case 'select':
                    return templates.select;
                case 'textarea':
                    return templates.getD2Input(templates.textarea);
                default:
                    return templates.getD2Input(templates.input);
            }
        }

        static postLink(scope, element, attr, controller) {
            controller.formFieldsManager = controller.manager ? controller.manager : d2FormFields.getManager();

            //Form manager that is used to manage the forms fields
            const propertyNames = controller.model.modelDefinition.getOwnedPropertyNames()
                .filter(propertyName => !controller.formFieldsManager.getFieldNamesToIgnoreOnDisplay().includes(propertyName))

            controller.formFields = propertyNames
                .map(controller.getFieldConfig.bind(controller))
                .map(controller.applyTypeOverrides)
                .filter(fieldConfig => {
                    if (fieldConfig.type) {
                        return true;
                    }
                    $log.warn('No field type found for ' + fieldConfig.name, fieldConfig);
                });

            controller.hasHeaderFields = () => controller.formFields.filter(fieldConfig => fieldConfig.isHeadField).length
            controller.hasNormalFields = () => controller.formFields.filter(fieldConfig => !fieldConfig.isHeadField).length
        }
    }

    return {
        restrict: 'E',
        scope: {
            model: '=',
            manager: '='
        },
        controller: D2FormController,
        bindToController: true,
        controllerAs: 'd2Form',
        template: `
           <div>
             <div class="d2-form-fields d2-form-fields-head" ng-show="d2Form.hasHeaderFields()">
                 <div ng-repeat="field in d2Form.formFields | filter: {isHeadField: true}">
                     <d2-form-for-model-field-type ng-hide="field.hideWhen(d2Form.model)"></d2-form-for-model-field-type>
                 </div>
             </div>
             <div class="d2-form-fields d2-form-fields-main" ng-show="d2Form.hasNormalFields()">
                 <div ng-repeat="field in d2Form.formFields | filter: {isHeadField: false}">
                     <d2-form-for-model-field-type ng-hide="field.hideWhen(d2Form.model)"></d2-form-for-model-field-type>
                 </div>
             </div>
           </div>
       `,
        link: D2FormController.postLink
    };
};
'use strict';

export default function configureAngularFormly(formlyConfig) {
    formlyConfig.setWrapper({
        name: 'wrapper-label',
        template: `
            <d2-input>
                <label for="{{id}}">{{to.label}}<i ng-if="to.required" class="fa fa-asterisk input-required-icon"></i></label>
                <formly-transclude></formly-transclude>
            </d2-input>
        `
    });

    formlyConfig.setType({
        name: 'input',
        template: `
            <input
              ng-model="model[options.key]"
              ng-maxlength="to.maxLength"
              ng-minlength="to.minLength"
              type="text"
            />`,
        defaultOptions: {
            wrapper: ['wrapper-label'],
            className: 'd2-field-input'
        }
    });

    formlyConfig.setType({
        name: 'text',
        template: `
            <textarea
              ng-model="model[options.key]"
              ng-maxlength="to.maxLength"
              ng-minlength="to.minLength"
            ></textarea>`,
        defaultOptions: {
            wrapper: ['wrapper-label'],
            className: 'd2-field-input'
        }
    });

    formlyConfig.setType({
        name: 'select',
        template: `<select ng-model="model[options.key]"></select>`,
        defaultOptions(options) {
            /* jshint maxlen:199 */
            let ngOptions = options.templateOptions.ngOptions || `option[to.valueProp || 'value'] as option[to.labelProp || 'name'] group by option[to.groupProp || 'group'] for option in to.options`;
            return {
                ngModelAttrs: {
                    [ngOptions]: {
                        value: 'ng-options'
                    }
                },
                wrapper: ['wrapper-label'],
                className: 'd2-field-select'
            };
        }
    });

    formlyConfig.setType({
        name: 'checkbox',
        template: `
            <d2-checkbox ng-model="model[options.key]"></d2-checkbox>
        `,
        defaultOptions: {
            wrapper: ['wrapper-label'],
            className: 'd2-field-checkbox'
        }
    });

    formlyConfig.setType({
        name: 'multiselect',
        template: `
            <div>
                <label>{{to.label}}<i ng-if="to.required" class="fa fa-asterisk input-required-icon"></i></label>
                <d2-select-from-list ng-model="model[options.key]" available-source="options.data.source" reference-type="options.data.referenceType"></d2-select-from-list>
            </div>`,
        defaultOptions: {
            className: 'd2-field-multiselect'
        }
    });
}

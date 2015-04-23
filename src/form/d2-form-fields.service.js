let fieldNamesToIgnoreOnDisplay = ['id', 'publicAccess', 'created', 'lastUpdated', 'user'];
let headerFieldNames = ['name', 'shortName', 'code'];
let typeMap = {
    text: ['TEXT', 'IDENTIFIER'],
    select: ['CONSTANT'],
    reference: ['REFERENCE']
};

export class D2FormFieldsManager {
    constructor() {
        this.fieldOverrides = {};
    }

    getFieldNamesToIgnoreOnDisplay() {
        return fieldNamesToIgnoreOnDisplay;
    }

    getHeaderFieldNames() {
        return headerFieldNames;
    }

    getTypeMap() {
        return typeMap;
    }

    getFieldTemplates() {
        return {
            selectForValues: `<select name="{{field.name}}"
                        ng-model="d2Form.model[field.property]"
                        ng-required="field.required"
                        ng-change="field.onChange(d2Form.model)"
                        ng-options="value for value in field.options">
                     </select>`,
            selectForObjects: `<select name="{{field.name}}"
                        ng-model="d2Form.model[field.property]"
                        ng-required="field.required"
                        ng-change="field.onChange(d2Form.model)"
                        ng-options="model.name for model in field.options track by model.id">
                     </select>
                     <div class="d2-select-loading-indicator fa fa-spinner fa-pulse" ng-show="field.loading"></i>`,
            textarea: `<textarea name="{{field.name}}" ng-model="d2Form.model[field.property]" ng-required="field.required"></textarea>`,
            getD2FormField: function (fieldTemplate) {
                return `<d2-input>
                <label>{{field.name}}</label>
                ${fieldTemplate}
            </d2-input>`
            },
            input: `<input name="{{field.name}}"
                           type="{{field.type}}"
                           placeholder="{{field.placeholder}}"
                           ng-model="d2Form.model[field.property]"
                           ng-required="field.required"
                           ng-change="field.onChange(d2Form.model)"
                           />`,
        }
    }

    addFieldOverrideFor(fieldName, fieldConfig) {
        this.fieldOverrides[fieldName] = fieldConfig;
        return this;
    }

    getFieldOverrideFor(fieldName) {
        return this.fieldOverrides[fieldName] || {};
    }
}

class D2FormFields {
    getManager() {
        return new D2FormFieldsManager();
    }
}

export default D2FormFields;

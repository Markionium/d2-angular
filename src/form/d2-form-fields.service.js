let fieldNamesToIgnoreOnDisplay = ['id', 'publicAccess', 'created', 'lastUpdated'];
let headerFieldNames = ['name', 'shortName', 'code'];
let typeMap = {
    text: ['TEXT', 'IDENTIFIER'],
    select: ['CONSTANT']
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
            select: `<label>{{field.name}}</label>
             <select name="{{field.name}}"
                     ng-model="d2Form.model[field.property]"
                     ng-required="field.required"
                     ng-change="field.onChange(d2Form.model)">
                 <option ng-selected="d2Form.model[field.property] == option"
                         value="{{option}}"
                         ng-repeat="option in field.options"
                         ng-bind="option | lowercase">
                 </option>
             </select>`,
                textarea: `<textarea name="{{field.name}}" ng-model="d2Form.model[field.property]" ng-required="field.required"></textarea>`,
            getD2Input: function (fieldTemplate) { return `<d2-input>
                <label>{{field.name}}</label>
                ${fieldTemplate}
            </d2-input>`},
            input: `<input name="{{field.name}}"
                           type="{{field.type}}"
                           placeholder="{{field.placeholder}}"
                           ng-model="d2Form.model[field.property]"
                           ng-required="field.required"
                           ng-change="field.onChange(d2Form.model)"
                           />`
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

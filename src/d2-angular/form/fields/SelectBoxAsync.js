'use strict';

import SelectBox from 'd2-angular/form/fields/SelectBox';

class SelectBoxAsync extends SelectBox {
    constructor(options) {
        super(options);

        //Override the ngOptions for this template as we want to `track by` ib the object id
        this.templateOptions.ngOptions = `option.name for option in to.options track by option.id`;

        this.data = {
            loading: true
        };

        //FIXME: Poor mans promise detection
        if (options.source && options.source.then && options.source.catch) {
            this.data.sourcePromise = options.source
                .then(result => {
                    this.templateOptions.options = result;
                    this.data.loading = false;
                    return result;
                })
                .then(() => {
                    //FIXME Dirty hack to run apply
                    let element = document.querySelector('#' + this.id);
                    if (element) {
                        window.angular.element(element).scope().$digest();
                    }
                })
                .catch(error => {
                    this.data.loading = false;
                    window.error && window.error(error);
                    throw new Error('Unable to load values for: ' + options.fieldName);
                });
        }
    }

    static create(modelValidation, models) {
        modelValidation.templateOptions = modelValidation.templateOptions || {};

        if (models[modelValidation.referenceType]) {
            modelValidation.source = models[modelValidation.referenceType]
                .list({paging: false})
                .then(modelCollection => modelCollection.toArray());
            return new SelectBoxAsync(modelValidation);
        }
        throw new Error('Passed model does not have the the a reference to the type: ' + modelValidation.referenceType);
    }
}
SelectBox.FIELDS_NOT_TO_COPY = SelectBox.FIELDS_NOT_TO_COPY.concat(['source']);

export default SelectBoxAsync;

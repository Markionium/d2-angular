'use strict';

export function camelCaseToUnderscores(wordToTransform) {
    return wordToTransform.replace(/[a-z][A-Z]/g, function (match) {
        return [match.charAt(0), match.charAt(1).toLowerCase()].join('_');
    });
}

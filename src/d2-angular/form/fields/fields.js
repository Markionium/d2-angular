import CheckBox from 'd2-angular/form/fields/CheckBox';
import InputBox from 'd2-angular/form/fields/InputBox';
import SelectBox  from 'd2-angular/form/fields/SelectBox';

const CHECKBOX = Symbol('CHECKBOX');
const INPUT = Symbol('INPUT');
const SELECT = Symbol('SELECT');

export let fieldTypeClasses = new Map([
    [CHECKBOX, CheckBox],
    [INPUT, InputBox],
    [SELECT, SelectBox]
]);

export let typeToFieldMap = new Map([
    ['BOOLEAN', CHECKBOX],
    ['CONSTANT', SELECT],
    ['IDENTIFIER', INPUT],
    ['REFERENCE', SELECT],
    ['TEXT', INPUT]
]);

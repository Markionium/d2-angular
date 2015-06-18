import CheckBox from 'd2-angular/form/fields/CheckBox';
import InputBox from 'd2-angular/form/fields/InputBox';
import SelectBox  from 'd2-angular/form/fields/SelectBox';
import SelectBoxAsync  from 'd2-angular/form/fields/SelectBoxAsync';

export const CHECKBOX = Symbol('CHECKBOX');
export const INPUT = Symbol('INPUT');
export const SELECT = Symbol('SELECT');
export const SELECTASYNC = Symbol('SELECTASYNC');

export let fieldTypeClasses = new Map([
    [CHECKBOX, CheckBox],
    [INPUT, InputBox],
    [SELECT, SelectBox],
    [SELECTASYNC, SelectBoxAsync]
]);

export let typeToFieldMap = new Map([
    ['BOOLEAN', CHECKBOX],
    ['CONSTANT', SELECT],
    ['IDENTIFIER', INPUT],
    ['REFERENCE', SELECTASYNC],
    ['TEXT', INPUT]
]);

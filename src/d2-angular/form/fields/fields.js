import CheckBox from 'd2-angular/form/fields/CheckBox';
import InputBox from 'd2-angular/form/fields/InputBox';
import SelectBox  from 'd2-angular/form/fields/SelectBox';
import SelectBoxAsync  from 'd2-angular/form/fields/SelectBoxAsync';
import MultiSelectBox from 'd2-angular/form/fields/MultiSelectBox';
import TextBox from 'd2-angular/form/fields/TextBox';

export const CHECKBOX = Symbol('CHECKBOX');
export const INPUT = Symbol('INPUT');
export const SELECT = Symbol('SELECT');
export const SELECTASYNC = Symbol('SELECTASYNC');
export const MULTISELECT = Symbol('MULTISELECT');
export const TEXT = Symbol('TEXT');

export let fieldTypeClasses = new Map([
    [CHECKBOX, CheckBox],
    [INPUT, InputBox],
    [SELECT, SelectBox],
    [SELECTASYNC, SelectBoxAsync],
    [MULTISELECT, MultiSelectBox],
    [TEXT, TextBox]
]);

export let typeToFieldMap = new Map([
    ['BOOLEAN', CHECKBOX],
    ['CONSTANT', SELECT],
    ['IDENTIFIER', INPUT],
    ['REFERENCE', SELECTASYNC],
    ['TEXT', INPUT],
    ['COLLECTION', MULTISELECT],
    ['INTEGER', INPUT], //TODO: Add Numberfield!
    ['URL', INPUT] //TODO: Add Url field?
]);

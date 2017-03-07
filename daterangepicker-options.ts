import * as moment from 'moment';

export class Options {
    startDate;
    endDate;
    minDate;
    maxDate;
    dateLimit = false;
    singleDatePicker = false;
    format;
    inactiveBeforeStart = false;
    autoApply: boolean;
    timePicker: boolean;
}
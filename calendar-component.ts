import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
declare var require: any;
var moment = require('moment');
require('moment-range');

@Component({
    moduleId: 'module.id',
    selector: 'calendar',
    template: `
        <div class="col-md-12 text-center flush">
            <div class="col-md-2 flush">
                <span class="col-md-12 flush clickable clickable-link" (click)="monthSelected(-1)">
                    <i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i>
                </span>
            </div>
            <span class="col-md-8 float-left text-center nudge-top">
                <label> {{monthText}} {{year}} </label>
            </span>
            <div class="col-md-2 flush">
                <span class="col-md-12 pull-right flush clickable clickable-link" (click)="monthSelected(1)">
                    <i class="fa fa-chevron-right glyphicon glyphicon-chevron-right"></i>
                </span>
            </div>
        </div>
        <div class="col-md-12 flush">
            <table class="table table-condensed flush">
                <thead>
                    <th>Su</th>
                    <th>Mo</th>
                    <th>Tu</th>
                    <th>We</th>
                    <th>Th</th>
                    <th>Fr</th>
                    <th>Sa</th>
                </thead>
                <tbody>
                    <tr *ngFor="let week of weekList; let i = index">
                        <td *ngFor="let day of weekList[i]" (click)="dateSelected(day)" class="clickable" [ngClass]="{'off':!isDateAvailable(day),'active':isSelectedDate(day),'disabled':isDisabled(day)}">
                            {{ day.format('D') }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
})
export class CalendarComponent implements OnChanges {
    @Input() month: string;
    @Input() year: string;
    @Input() selectedFromDate: string;
    @Input() selectedToDate: string;
    @Input() isLeft: boolean;
    @Input() format: string;
    @Input() minDate: string;
    @Input() maxDate: string;
    @Input() inactiveBeforeStart: boolean;
    get monthText() {
        let months = moment.monthsShort()
        return months[this.month];
    }
    @Output() dateChanged = new EventEmitter();
    @Output() monthChanged = new EventEmitter();

    weekList: any;

    getWeekNumbers(monthRange: any) {
        let weekNumbers = [];
        let indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
        monthRange.by('days', function(moment) {
            let ref;
            if (weekNumbers.length < 6 && (ref = moment.week(), indexOf.call(weekNumbers, ref)) < 0) {
                return weekNumbers.push(moment.week());
            }
        });
        return weekNumbers;
    }

    getWeeksRange(weeks: any, year: any, month: any) {
        let weeksRange = [];

        for (let i = 0, len = weeks.length; i < len; i++) {
            let week = weeks[i];
            let firstWeekDay, lastWeekDay;
            if (i > 0 && week < weeks[i - 1]) {
                firstWeekDay = moment([year, month]).add(1, "year").week(week).day(0);
                lastWeekDay = moment([year, month]).add(1, "year").week(week).day(6);
            }
            else {
                firstWeekDay = moment([year, month]).week(week).day(0);
                lastWeekDay = moment([year, month]).week(week).day(6);
            }
            let weekRange = moment.range(firstWeekDay, lastWeekDay);
            weeksRange.push(weekRange);
        }
        return weeksRange;
    }
    createCalendarGridData(): void {
        let year = this.year;
        let month = this.month;
        let startDate = moment([year, month]);
        let firstDay = moment(startDate).startOf('month');
        let endDay = moment(startDate).add(60, 'd');
        let monthRange = moment.range(firstDay, endDay);
        let weeksRange = [];
        weeksRange = this.getWeeksRange(this.getWeekNumbers(monthRange), year, month);

        let weekList = [];
        weeksRange.map(function(week) {
            let daysList = [];
            week.by('days', function(day) {
                daysList.push(day);
            });
            weekList.push(daysList);
        });
        this.weekList = weekList;
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.createCalendarGridData();
    }
    isDisabled(day) {
        if (day.isBefore(moment(this.minDate, this.format)) || day.isAfter(moment(this.maxDate, this.format))) {
            return true;
        }
    }
    isDateAvailable(day) {
        if (day.get('month') !== this.month) {
            return false;
        }
        if (this.inactiveBeforeStart && !this.isLeft && day.isBefore(this.selectedFromDate)) {
            return false;
        }
        return true;
    }
    isSelectedDate(day) {
        if (day.get('month') === this.month && day.isSameOrAfter(this.selectedFromDate, 'date') && day.isSameOrBefore(this.selectedToDate, 'date')) {
            return true;
        }
    }
    dateSelected(day) {
        this.dateChanged.emit({
            day: day,
            isLeft: this.isLeft
        });
    }
    monthSelected(value) {
        this.monthChanged.emit({
            value: value,
            isLeft: this.isLeft
        })
    }
}

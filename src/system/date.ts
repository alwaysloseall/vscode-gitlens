'use strict';
import { distanceInWordsToNow as _fromNow, format as _format } from 'date-fns';
import * as en from 'date-fns/locale/en';
import lang from '../i18n';

const MillisecondsPerMinute = 60000; // 60 * 1000
const MillisecondsPerDay = 86400000; // 24 * 60 * 60 * 1000

// Taken from https://github.com/date-fns/date-fns/blob/601bc8e5708cbaebee5389bdaf51c2b4b33b73c4/src/locale/en/build_distance_in_words_locale/index.js
function buildDistanceInWordsLocale() {
    const distanceInWordsLocale: { [key: string]: string | { one: string, other: string } } = {
        lessThanXSeconds: {
            one: lang.lessThanASecond,
            other: `${lang.lessThan} {{count}} ${lang.seconds}`
        },

        xSeconds: {
            one: lang.oneSecond,
            other: `{{count}} ${lang.seconds}`
        },

        halfAMinute: lang.halfAMinute,

        lessThanXMinutes: {
            one: lang.aFewSeconds,
            other: `${lang.lessThan} {{count}} ${lang.minutes}`
        },

        xMinutes: {
            one: lang.aMinute,
            other: `{{count}} ${lang.minutes}`
        },

        aboutXHours: {
            one: lang.anHour,
            other: `{{count}} ${lang.hours}`
        },

        xHours: {
            one: lang.anHour,
            other: `{{count}} ${lang.hours}`
        },

        xDays: {
            one: lang.aDay,
            other: `{{count}} ${lang.days}`
        },

        aboutXMonths: {
            one: lang.aMonth,
            other: `{{count}} ${lang.months}`
        },

        xMonths: {
            one: lang.aMonth,
            other: `{{count}} ${lang.months}`
        },

        aboutXYears: {
            one: lang.aYear,
            other: `{{count}} ${lang.years}`
        },

        xYears: {
            one: lang.aYear,
            other: `{{count}} ${lang.years}`
        },

        overXYears: {
            one: lang.aYear,
            other: `{{count}} ${lang.years}`
        },

        almostXYears: {
            one: lang.aYear,
            other: `{{count}} ${lang.years}`
        }
    };

    function localize(token: string, count: number, options: any) {
        options = options || {};

        if (count === 12 && token === 'xMonths') {
            token = 'aboutXYears';
            count = 1;
        }

        const result = distanceInWordsLocale[token];

        let value: string;
        if (typeof result === 'string') {
            value = result;
        }
        else {
            if (count === 1) {
                value = result.one;
            }
            else {
                value = result.other.replace('{{count}}', count.toString());
            }
        }

        if (!options.addSuffix) return value;

        if (options.comparison > 0) return 'in ' + value;

        return value + ` ${lang.ago}`;
    }

    return {
        localize: localize
    };
}

// Monkey patch the locale to customize the wording
const patch = (en as any);
patch.distanceInWords = buildDistanceInWordsLocale();

const formatterOptions = { addSuffix: true, locale: patch };

export namespace Dates {

    export interface IDateFormatter {
        fromNow: () => string;
        format: (format: string) => string;
    }

    export function dateDaysFromNow(date: Date, now: number = Date.now()) {
        const startOfDayLeft = startOfDay(now);
        const startOfDayRight = startOfDay(date);

        const timestampLeft = startOfDayLeft.getTime() - startOfDayLeft.getTimezoneOffset() * MillisecondsPerMinute;
        const timestampRight = startOfDayRight.getTime() - startOfDayRight.getTimezoneOffset() * MillisecondsPerMinute;

        return Math.round((timestampLeft - timestampRight) / MillisecondsPerDay);
    }

    export function startOfDay(date: Date | number) {
        const newDate = new Date(typeof date === 'number' ? date : date.getTime());
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }

    export function toFormatter(date: Date): IDateFormatter {
        return {
            fromNow: () => {
                return _fromNow(date, formatterOptions);
            },
            format: (format: string) => _format(date, format)
        };
    }
}
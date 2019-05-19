import { TestBed, inject } from '@angular/core/testing';

import { PosixService } from './posix.service';
import { DataService } from './data.service';
import Spy = jasmine.Spy;
import * as fixture from '../fixture.spec';

describe('PosixService', () => {

  let service: PosixService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PosixService,
        DataService,
      ]
    });

    service = TestBed.get(PosixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set baseFrequency on init', () => {
    expect(service.baseFrequency).toEqual(fixture.baseFrequencyForService);
  });

  it('should return default frequency on getDefaultFrequency call with baseFrequency set to value of first' +
    'element of DataService baseFrequency', () => {
    const expected = {
      baseFrequency: fixture.baseFrequency[0].value,
      minutes: [],
      hours: [],
      daysOfMonth: [],
      daysOfWeek: [],
      months: []
    };

    expect(service.getDefaultFrequency()).toEqual(expected);
  });


  it('should return array of elements witch was split by "," on getValueArray call with sting with comma passed', () => {
    const expected = [1, 4, 6];
    const testExpr = '1,4,6';

    expect(service.getValueArray(testExpr)).toEqual(expected);
  });

  it('should return array of elements witch was split by "," on getValueArray call with value passed', () => {
    const expected = [146];
    const testExpr = '146';

    expect(service.getValueArray(testExpr)).toEqual(expected);
  });

  it('should return empty array on getValueArray call with no value', () => {
    const expected = [];
    const testExpr = null;

    expect(service.getValueArray(testExpr)).toEqual(expected);
  });

  describe('parse posix cron expression on fromCron call and return correct frequency', () => {
    it('should return default frequency on fromCron call with incorrect in length cron expression', () => {
      const expWrongOne = '* * 11 1';
      const expWrongTwo = '* * 11 1 1 3 4,12, 1 *';
      const expected = {
        baseFrequency: fixture.baseFrequency[0].value,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };

      expect(service.fromCron(expWrongOne)).toEqual(expected);
      expect(service.fromCron(expWrongTwo)).toEqual(expected);
    });

    it('should parse * * * * * as every minute', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.minute,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '* * * * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "4 * * * * as on every 4 minute of each hour', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [4],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '4 * * * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "4,10 * * * *" as on every 4 and 10 minute of each hour', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [4, 10],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '4,10 * * * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "* 2 * * *" as on every 2 hour of each day', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [2],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '* 2 * * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "* 2,14 * * *" as on every 2 and 14 hour of each day', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [2, 14],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '* 2,14 * * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "10 2,14 * * *" as on every 2 and 10 min and 14 and 10 min hour of each day', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [10],
        hours: [2, 14],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '10 2,14 * * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "* * * * 1" as on every minute on Monday', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [1],
        months: []
      };
      const cronExpression = '* * * * 1';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "10 1 * * 1" as at 01:10 on Monday', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [10],
        hours: [1],
        daysOfMonth: [],
        daysOfWeek: [1],
        months: []
      };
      const cronExpression = '10 1 * * 1';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "* * 1 * *" as at every minute on day-of-month 1.', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [],
        hours: [],
        daysOfMonth: [1],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '* * 1 * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "23 3 1 * *" as at 03:23 on day-of-month 1', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [23],
        hours: [3],
        daysOfMonth: [1],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '23 3 1 * *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "* * * 1 *" as at every minute in January', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: [1]
      };
      const cronExpression = '* * * 1 *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "10 1 12 1 *" as at 01:10 on day-of-month 12 in January', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [10],
        hours: [1],
        daysOfMonth: [12],
        daysOfWeek: [],
        months: [1]
      };
      const cronExpression = '10 1 12 1 *';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it('should parse "1 1 1 * 1" as at 01:01 on day-of-month 1 and on Monday', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.none,
        minutes: [1],
        hours: [1],
        daysOfMonth: [1],
        daysOfWeek: [1],
        months: []
      };
      const cronExpression = '1 1 1 * 1';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });
  });

  describe('parse frequency object to posix cron expression on setCron with frequency object', () => {
    it('should return empty string if no value as passed', () => {
      expect(service.setCron(null)).toEqual('');
    });

    it('should return empty string when baseFrequency key of frequency object was set to none on' +
      'baseFrequencyForService', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.none,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };

      expect(service.setCron(frequency)).toEqual('');
    });

    it('should return "* * * * *" when baseFrequency was set to minute on baseFrequencyForService', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.minute,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '* * * * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "10 * * * *" when baseFrequency was set to hour on baseFrequencyForService min set to 10', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [10],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '10 * * * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "10,14 * * * *" when baseFrequency was set to hour on baseFrequencyForService min set to 10,14', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [10, 14],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '10,14 * * * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* 1 * * *" when baseFrequency was set to day on baseFrequencyForService and hours set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [1],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '* 1 * * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* 1,10 * * *" when baseFrequency was set to day on baseFrequencyForService and hours set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [1, 10],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '* 1,10 * * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* * * * 1" when baseFrequency was set to week on baseFrequencyForService and daysOfWeek set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [1],
        months: []
      };
      const expected = '* * * * 1';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* * * * 1,5" when baseFrequency was set to week on baseFrequencyForService and daysOfWeek set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [1, 5],
        months: []
      };
      const expected = '* * * * 1,5';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* * * * *" when baseFrequency was set to week on baseFrequencyForService and daysOfWeek set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '* * * * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* * 1 * *" when baseFrequency was set to month on baseFrequencyForService and daysOfMonth set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [],
        hours: [],
        daysOfMonth: [1],
        daysOfWeek: [],
        months: []
      };
      const expected = '* * 1 * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* * 1,23 * *" when baseFrequency was set to month on baseFrequencyForService and daysOfMonth set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [],
        hours: [],
        daysOfMonth: [1, 23],
        daysOfWeek: [],
        months: []
      };
      const expected = '* * 1,23 * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* * * 3 *" when baseFrequency was set to year on baseFrequencyForService and months set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: [3]
      };
      const expected = '* * * 3 *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "* * * 3,4 *" when baseFrequency was set to year on baseFrequencyForService and months set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: [3, 4]
      };
      const expected = '* * * 3,4 *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "10 4 2 3,4 *" when baseFrequency was set to year on baseFrequencyForService ' +
      'and all data set beside daysOfWeek', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [10],
        hours: [4],
        daysOfMonth: [2],
        daysOfWeek: [],
        months: [3, 4]
      };
      const expected = '10 4 2 3,4 *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "10 4 2 * *" when baseFrequency was set to year on baseFrequencyForService ' +
      'and all data set beside daysOfWeek', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [10],
        hours: [4],
        daysOfMonth: [2],
        daysOfWeek: [],
        months: []
      };
      const expected = '10 4 2 * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });
  });
});

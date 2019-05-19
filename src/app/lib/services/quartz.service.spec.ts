import { TestBed, inject } from '@angular/core/testing';

import { QuartzService } from './quartz.service';
import { DataService } from './data.service';
import * as fixture from '../fixture.spec';

describe('QuartzService', () => {
  let service: QuartzService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuartzService,
      DataService]
    });

    service = TestBed.get(QuartzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parse quartz cron expression on fromCron call and return correct frequency', () => {
    it('should return default frequency on fromCron call with incorrect in length cron expression', () => {
      const expWrongOne = '0 * * * ?';
      const expWrongTwo = '0 * * * 1 2 3 ?';
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

    it('should parse "0 * * * * ?" as at second :00 of every minute', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.minute,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 * * * * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 4 * * * ?" as at second :00 of minute :04 of every hour', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [4],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 4 * * * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 4,10 * * * ?" as at second :00, at minutes :04 and :10, of every hour', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [4, 10],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 4,10 * * * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 * 2 * * ?" as every minute at second :00 between 02am and 03am', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [2],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 * 2 * * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 * 2,14 * * ?" as at second :00, every minute, at 02am and 14pm, of every day', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [2, 14],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 * 2,14 * * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 10 2,14 * * ?" as at second :00, at minute :10, at 02am and 14pm, of every day', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [10],
        hours: [2, 14],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 10 2,14 * * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 * * ? * 2" as at second :00 of every minute, on every Monday, every month', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [2],
        months: []
      };
      const cronExpression = '0 * * ? * 2';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 10 1 ? * 2" as at 01:10:00am, on every Monday, every month', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [10],
        hours: [1],
        daysOfMonth: [],
        daysOfWeek: [2],
        months: []
      };
      const cronExpression = '0 10 1 ? * 2';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 * * 1 * ?" as at second :00 of every minute, on the 1st day, every month', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [],
        hours: [],
        daysOfMonth: [1],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 * * 1 * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 23 1 1 * ?" as at 01:23:00am, on the 1st day, every month', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [23],
        hours: [1],
        daysOfMonth: [1],
        daysOfWeek: [],
        months: []
      };
      const cronExpression = '0 23 1 1 * ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 * * * 1 ?" as at second :00 of every minute, every day, in January', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: [1]
      };
      const cronExpression = '0 * * * 1 ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 10 1 12 1 ?" as at 01:10:00am, on the 12th day, in January', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [10],
        hours: [1],
        daysOfMonth: [12],
        daysOfWeek: [],
        months: [1]
      };
      const cronExpression = '0 10 1 12 1 ?';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });

    it ('should parse "0 1 1 ? * 2" as At 01:01:00am, on every Monday, every month', () => {
      const expected = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [1],
        hours: [1],
        daysOfMonth: [],
        daysOfWeek: [2],
        months: []
      };
      const cronExpression = '0 1 1 ? * 2';

      expect(service.fromCron(cronExpression)).toEqual(expected);
    });
  });
  describe('parse frequency object to quartz cron expression on setCron with frequency object', () => {
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

    it('should return "0 * * * * ?" when baseFrequency was set to minute on baseFrequencyForService', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.minute,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 * * * * ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 10 * * * ?" when baseFrequency was set to hour on baseFrequencyForService and minutes set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [10],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 10 * * * ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });
    it('should return "0 10,14 * * * ?" when baseFrequency was set to hour on baseFrequencyForService and minutes set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.hour,
        minutes: [10, 14],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 10,14 * * * ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * 1 * * ?" when baseFrequency was set to day on baseFrequencyForService and hours set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [1],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 * 1 * * ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * 1,10 * * ?" when baseFrequency was set to day on baseFrequencyForService and hours set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.day,
        minutes: [],
        hours: [1, 10],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 * 1,10 * * ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * * ? * 2" when baseFrequency was set to week on baseFrequencyForService and daysOfWeek set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [2],
        months: []
      };
      const expected = '0 * * ? * 2';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * * ? * 2,6" when baseFrequency was set to week on baseFrequencyForService and daysOfWeek set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [2, 6],
        months: []
      };
      const expected = '0 * * ? * 2,6';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * * ? * *" when baseFrequency was set to week on baseFrequencyForService and daysOfWeek set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.week,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 * * ? * *';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * * 1 * ?" when baseFrequency was set to month on baseFrequencyForService and daysOfMonth set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [],
        hours: [],
        daysOfMonth: [1],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 * * 1 * ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * * 1,23 * ?" when baseFrequency was set to month on baseFrequencyForService and daysOfMonth set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.month,
        minutes: [],
        hours: [],
        daysOfMonth: [1, 23],
        daysOfWeek: [],
        months: []
      };
      const expected = '0 * * 1,23 * ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * * * 3 ?" when baseFrequency was set to year on baseFrequencyForService and months set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: [3]
      };
      const expected = '0 * * * 3 ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 * * * 3,4 ?" when baseFrequency was set to year on baseFrequencyForService and months set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [],
        hours: [],
        daysOfMonth: [],
        daysOfWeek: [],
        months: [3, 4]
      };
      const expected = '0 * * * 3,4 ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 10 4 2 3,4 ?" when baseFrequency was set to year on baseFrequencyForService and months set', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [10],
        hours: [4],
        daysOfMonth: [2],
        daysOfWeek: [],
        months: [3, 4]
      };
      const expected = '0 10 4 2 3,4 ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });

    it('should return "0 10 4 2 2 ?" when baseFrequency was set to year on baseFrequencyForService ' +
      'and all data set beside daysOfWeek', () => {
      const frequency = {
        baseFrequency: fixture.baseFrequencyForService.year,
        minutes: [10],
        hours: [4],
        daysOfMonth: [2],
        daysOfWeek: [],
        months: [2]
      };
      const expected = '0 10 4 2 2 ?';

      expect(service.setCron(frequency)).toEqual(expected);
    });
  });
});

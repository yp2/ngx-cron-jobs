import { TestBed, inject } from '@angular/core/testing';

import * as fixture from '../fixture.spec';
import { DataService } from './data.service';

describe('DataService', () => {

  let dataService: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });

    dataService = TestBed.get(DataService);
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should return baseFrequency', () => {
    expect(dataService.baseFrequency).toEqual(fixture.baseFrequency);
  });

  it('should return daysOfMonth', () => {
    expect(dataService.daysOfMonth).toEqual(fixture.numeral);
  });

  it('should return months', () => {
    expect(dataService.months).toEqual(fixture.months);
  });

  it('should return hours', () => {
    const expected = fixture.getHours();

    expect(dataService.hours).toEqual(expected);
  });

  it('should return minutes', () => {
    const expected = fixture.getMinutes();

    expect(dataService.minutes).toEqual(expected);
  });

  it('should return default config on getConfig call', () => {
    expect(dataService.getConfig()).toEqual(fixture.defaultConfig);
  });

  it('should return override config on getConfig call with override object', () => {
    const expected = {
      quartz: true,
      bootstrap: false,
      multiple: true,
    };

    expect(dataService.getConfig(expected)).toEqual(expected);
    expect(dataService.getConfig(expected)).not.toBe(expected);
  });

  it('should return default validateConfig on getValidate call', () => {
    expect(dataService.getValidate()).toEqual(fixture.defaultValidateConfig);
  });

  it('should return override validate config on getValidate call with override object', () => {
    const expected = {
      validate: false,
    };

    expect(dataService.getValidate(expected)).toEqual(expected);
    expect(dataService.getValidate(expected)).not.toBe(expected);
  });

  it('should return daysOfWeek for posix cron on getDaysOfWeek call', () => {
    expect(dataService.getDaysOfWeek()).toEqual(fixture.daysOfWeekPosix);
  });

  it('should return daysOfWeek for quartz cron', () => {
    expect(dataService.getDaysOfWeek(true)).toEqual(fixture.daysOfWeekQuartz);
  });
});

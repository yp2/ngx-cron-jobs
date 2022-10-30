import { Injectable } from '@angular/core';
import { CronJobsConfig, CronJobsSelectOption, CronJobsValidationConfig, OptionType } from '../contracts/contracts';

@Injectable()
export class DataService {
  private defaultConfig: CronJobsConfig = {
    quartz: false,
    bootstrap: true,
    multiple: false,
  };

  private defaultValidateConfig: CronJobsValidationConfig = {
    validate: false,
  };

  private daysBase: Array<CronJobsSelectOption> = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  private daysOfWeekPosix: Array<CronJobsSelectOption> = [...this.daysBase];

  private daysOfWeekQuartz: Array<CronJobsSelectOption> = [
    ...this.daysBase.map((day, i) => ({
      ...day,
      value: i + 1,
    })),
  ];

  private numeral: Array<CronJobsSelectOption> = [
    ...new Array(31).fill(0).map((_, index) => {
      const value = index + 1;
      let suffix = "th";
      if (value <= 10 || value >= 20) {
        switch (value % 10) {
          case 1:
            suffix = "st";
            break;
          case 2:
            suffix = "nd";
            break;
          case 3:
            suffix = "rd";
            break;
        }
      }
      return {
        value,
        label: `${value}${suffix}`,
      };
    }),
  ];

  private _months: Array<CronJobsSelectOption> = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  private _baseFrequency: Array<CronJobsSelectOption> = [
    { value: 0, label: "Please select" },
    { value: 1, type: OptionType.minute, label: "Minute" },
    { value: 2, type: OptionType.hour, label: "Hour" },
    { value: 3, type: OptionType.day, label: "Day" },
    { value: 4, type: OptionType.week, label: "Week" },
    { value: 5, type: OptionType.month, label: "Month" },
    { value: 6, type: OptionType.year, label: "Year" },
  ];

  private _hours: Array<CronJobsSelectOption>;
  private _minutes: Array<CronJobsSelectOption>;

  public get baseFrequency(): Array<CronJobsSelectOption> {
    return [...this._baseFrequency];
  }

  public get daysOfMonth(): Array<CronJobsSelectOption> {
    return [...this.numeral];
  }

  public get months(): Array<CronJobsSelectOption> {
    return [...this._months];
  }

  public get hours(): Array<CronJobsSelectOption> {
    return [...this._hours];
  }

  public get minutes(): Array<CronJobsSelectOption> {
    return [...this._minutes];
  }

  constructor() {
    this._hours = [];
    for (let x = 0; x < 24; x++) {
      this._hours.push(<CronJobsSelectOption>{ value: x, label: `${x}` });
    }

    this._minutes = [];
    for (let x = 0; x < 60; x = x + 5) {
      this._minutes.push(<CronJobsSelectOption>{ value: x, label: `${x}` });
    }
  }

  getConfig(config: CronJobsConfig = {}): CronJobsConfig {
    return {
      ...this.defaultConfig,
      ...config,
    };
  }

  getValidate(
    validateConfig: CronJobsValidationConfig = {}
  ): CronJobsValidationConfig {
    return {
      ...this.defaultValidateConfig,
      ...validateConfig,
    };
  }

  getDaysOfWeek(quartz: Boolean = false): Array<CronJobsSelectOption> {
    if (quartz) {
      return [...this.daysOfWeekQuartz];
    }
    return [...this.daysOfWeekPosix];
  }
}

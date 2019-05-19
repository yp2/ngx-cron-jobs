import { Injectable } from '@angular/core';
import { PosixService } from './posix.service';
import { DataService } from './data.service';
import { CronJobsFrequency, CronJobsSelectOption } from '../contracts/contracts';

@Injectable()
export class QuartzService extends PosixService {

  constructor(protected dataService: DataService) {
    super(dataService);
  }

  protected getDaysOfWeek(): Array<CronJobsSelectOption> {
    return this.dataService.getDaysOfWeek(true);
  }

  public fromCronWithDefault(value: String): CronJobsFrequency {
    const cron = value.trim().replace(/\s+/g, ' ').split(' ');
    const frequency = this.getDefaultFrequenceWithDefault();

    return this.fromCronQuartzInternal(cron, frequency);
  }

  public fromCron(value: String): CronJobsFrequency {
    const cron = value.trim().replace(/\s+/g, ' ').split(' ');
    const frequency = this.getDefaultFrequency();
    return this.fromCronQuartzInternal(cron, frequency);
  }

  private fromCronQuartzInternal(cron: string[], frequency: CronJobsFrequency) {
    if (!(cron.length === 6 || cron.length === 7)) {
      return frequency;
    }

    if (cron[1] === '*' && cron[2] === '*' && cron[3] === '*' && cron[4] === '*' && cron[5] === '?') {
      frequency.baseFrequency = this.baseFrequency.minute; // every minute
    } else if (cron[2] === '*' && cron[3] === '*' && cron[4] === '*' && cron[5] === '?') {
      frequency.baseFrequency = this.baseFrequency.hour; // every hour
    } else if (cron[3] === '*' && cron[4] === '*' && cron[5] === '?') {
      frequency.baseFrequency = this.baseFrequency.day; // every day
    } else if (cron[3] === '?' && cron[4] === '*') {
      frequency.baseFrequency = this.baseFrequency.week; // every week
    } else if (cron[4] === '*' && cron[5] === '?') {
      frequency.baseFrequency = this.baseFrequency.month; // every month
    } else if (cron[5] === '?') {
      frequency.baseFrequency = this.baseFrequency.year; // every year
    }
    if (cron[1] !== '*') {
      // preparing to handle multiple minutes
      frequency.minutes = this.getValueArray(cron[1]);
    }
    if (cron[2] !== '*') {
      // preparing to handle multiple hours
      frequency.hours = this.getValueArray(cron[2]);
    }
    if (cron[3] !== '*' && cron[3] !== '?') {
      // preparing to handle multiple days of the month
      frequency.daysOfMonth = this.getValueArray(cron[3]);
    }
    if (cron[4] !== '*') {
      // preparing to handle multiple months
      frequency.months = this.getValueArray(cron[4]);
    }
    if (cron[5] !== '*' && cron[5] !== '?') {
      // preparing to handle multiple days of the week
      frequency.daysOfWeek = this.getValueArray(cron[5]);
    }
    return frequency;
  }

  setCron(newValue: CronJobsFrequency) {
    const cron = ['0', '*', '*', '*', '*', '?'];

    if (newValue && newValue.baseFrequency) {
      if (newValue.baseFrequency >= this.baseFrequency.hour) {
        cron[1] = newValue.minutes.length > 0 ? newValue.minutes.join(',') : '*';
      }

      if (newValue.baseFrequency >= this.baseFrequency.day) {
        cron[2] = newValue.hours.length > 0 ? newValue.hours.join(',') : '*';
      }

      if (newValue.baseFrequency === this.baseFrequency.week) {
        cron[3] = '?';
        cron[5] = newValue.daysOfWeek.length > 0 ? newValue.daysOfWeek.join(',') : '*';
      }

      if (newValue.baseFrequency >= this.baseFrequency.month) {
        cron[3] = newValue.daysOfMonth.length > 0 ? newValue.daysOfMonth.join(',') : '*';
      }

      if (newValue.baseFrequency === this.baseFrequency.year) {
        cron[4] = newValue.months.length > 0 ? newValue.months.join(',') : '*';
      }
    } else {
      return '';
    }

    return cron.join(' ');
  }

}

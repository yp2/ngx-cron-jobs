export interface CronJobsBaseFrequency {
  none: number;
  minute: number;
  hour: number;
  day: number;
  week: number;
  month: number;
  year: number;
}

export interface CronJobsConfig {
  quartz?: boolean;
  multiple?: boolean;
  bootstrap?: boolean;
  option?: {};
}

export interface CronJobsFrequency {
  baseFrequency: number;
  minutes: Array<number>;
  hours: Array<number>;
  daysOfMonth: Array<number>;
  daysOfWeek: Array<number>;
  months: Array<number>;
}

export interface CronJobsSelectOption {
  value: number;
  type?: OptionType;
  label: string | number;
}

export enum OptionType {
  minute,
  hour,
  day,
  week,
  month,
  year
  }

export interface CronJobsValidationConfig {
  validate?: boolean;
}

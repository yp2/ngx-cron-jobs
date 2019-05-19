import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CronJobsComponent } from './cron-jobs.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import * as fixtures from '../fixture.spec';
import { Component, DebugElement } from '@angular/core';
import { PosixService } from '../services/posix.service';
import { QuartzService } from '../services/quartz.service';
import { DataService } from '../services/data.service';
import { cold } from 'jasmine-marbles';
import { CronJobsConfig, CronJobsValidationConfig } from '../contracts/contracts';
import { By } from '@angular/platform-browser';
import createSpy = jasmine.createSpy;

@Component({
  template:
  `
    <cron-jobs [formControl]="freqControl" [config]="cronConfig" [validate]="cronValidate"></cron-jobs>
    <cron-jobs [config]="cronConfig" [validate]="cronValidate"></cron-jobs>
  `
})
class TestReactiveComponent {

  freqControl: FormControl;
  freqSec = '';
  freqToSet = '';

  cronConfig: CronJobsConfig = {
    multiple: false,
    quartz: false,
    bootstrap: true
  };

  cronValidate: CronJobsValidationConfig = {
    validate: true
  };

  constructor() {
    this.freqControl = new FormControl();
    this.freqControl.valueChanges
      .subscribe(value => {
        this.freqSec = value;
      });
  }

  set(value: string) {
    this.freqToSet = value;
    this.setControl();
  }

  setControl() {
    this.freqControl.setValue(this.freqToSet);
  }
}

function getFormControlNames(list: Array<DebugElement>): Array<string> {
  return list.map((ele: DebugElement) => {
    return ele.attributes['formControlName'];
  });
}

describe('CronJobsComponent', () => {
  let testComponent: TestReactiveComponent;
  let testFixture: ComponentFixture<TestReactiveComponent>;
  let component: CronJobsComponent;
  let posixService: PosixService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [TestReactiveComponent, CronJobsComponent],
      providers: [DataService, PosixService, QuartzService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testFixture = TestBed.createComponent(TestReactiveComponent);
    posixService = TestBed.get(PosixService);
    testComponent = testFixture.componentInstance;
    component = testFixture.debugElement.query(By.css('cron-jobs')).componentInstance;
  });

  afterEach(() => {
    testComponent.cronConfig = {
      multiple: false,
      quartz: false,
      bootstrap: true
    };

    testComponent.cronValidate = {
      validate: true
    };
  });

  it('should create', () => {
    testFixture.detectChanges();
    expect(testComponent).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should create from group on creation', () => {
    const expected = ['baseFrequency', 'daysOfWeek', 'daysOfMonth', 'months', 'hours', 'minutes'];
    testFixture.detectChanges();
    expect(Object.keys(component.cronJobsForm.controls)).toEqual(expected);
  });

  it('should set config on creation', () => {
    testFixture.detectChanges();
    expect(component.config).toEqual(testComponent.cronConfig);
  });

  it('should set default config on creation when no config is passed', () => {
    testFixture.detectChanges();

    testComponent.cronConfig = undefined;

    testFixture.detectChanges();

    expect(component.config).toEqual(fixtures.defaultConfig);
  });

  it('should set validation config on creation', () => {
    testFixture.detectChanges();
    expect(component.validate).toEqual(testComponent.cronValidate);
  });

  it('should set default validation config on creation when no config is passed', () => {
    testFixture.detectChanges();

    testComponent.cronValidate = undefined;

    testFixture.detectChanges();

    expect(component.validate).toEqual(fixtures.defaultValidateConfig);
  });

  it('should set service on service change', () => {
    testFixture.detectChanges();

    const spy = spyOn(component, 'setService').and.callThrough();

    testComponent.cronConfig = {
      ...testComponent.cronConfig,
      quartz: true,
    };

    testFixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should create config on config change', () => {
    testFixture.detectChanges();

    const expected = {
      multiple: true,
      quartz: true,
      bootstrap: false
    };

    testComponent.cronConfig = {
      ...expected
    };

    testFixture.detectChanges();

    expect(component.config).toEqual(expected);
  });

  it('should create validation config on config change', () => {
    testFixture.detectChanges();

    const expected = {
      validate: false
    };

    testComponent.cronValidate = {
      ...expected
    };

    testFixture.detectChanges();

    expect(component.validate).toEqual(expected);
  });

  it('should set Posix service on setService call when config.quartz is false', fakeAsync(() => {
    testFixture.detectChanges();

    tick();
    component.cronJobsForm.get('baseFrequency').setValue('1');
    tick();
    testFixture.detectChanges();

    expect(testComponent.freqSec).toEqual('* * * * *');
  }));

  it('should set Quartz service on setService call when config.quartz is true', fakeAsync(() => {
    testComponent.cronConfig = {
      ...testComponent.cronConfig,
      quartz: true,
    };

    testFixture.detectChanges();

    tick();
    component.cronJobsForm.get('baseFrequency').setValue('1');
    tick();
    testFixture.detectChanges();

    expect(testComponent.freqSec).toEqual('0 * * * * ?');
  }));

  it('should set baseFrequency$ on init with value 0 ', fakeAsync(() => {
    const expected = cold('a', { a: 0 });

    testFixture.detectChanges();
    tick();

    expect(component.baseFrequency$).toBeObservable(expected);
  }));

  it('should change baseFrequency$ on baseFrequency form control change', fakeAsync(() => {
    testFixture.detectChanges();
    const expected = cold('a', { a: 2 });

    tick();
    component.cronJobsForm.get('baseFrequency').setValue('2');
    tick();
    testFixture.detectChanges();

    expect(component.baseFrequency$).toBeObservable(expected);
  }));

  it('should call onChange if cronJobsForm was changed and baseFrequency is different then 0', fakeAsync(() => {
    testFixture.detectChanges();
    const spy = spyOn(component, 'onChange').and.callThrough();

    tick();
    spy.calls.reset();
    component.cronJobsForm.get('baseFrequency').setValue('2');
    component.cronJobsForm.get('minutes').setValue(['5']);
    testFixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(2);
  }));

  it('should call onChange and call getDefaultFrequency and set cronJobsForm value to default one ' +
    'if cronJobsForm was changed and baseFrequency is set to 0', fakeAsync(() => {
      testFixture.detectChanges();
      const spy = spyOn(component, 'onChange').and.callThrough();
      const spyDefaultFreq = spyOn(posixService, 'getDefaultFrequenceWithDefault').and.callThrough();
      const expected = {
        baseFrequency: 0, daysOfWeek: [0], daysOfMonth: [1], months: [1], hours: [0], minutes: [0]
      };

      tick();
      component.cronJobsForm.get('baseFrequency').setValue('2');
      component.cronJobsForm.get('minutes').setValue(['5']);

      spy.calls.reset();
      spyDefaultFreq.calls.reset();
      component.cronJobsForm.get('baseFrequency').setValue('0');
      testFixture.detectChanges();
      tick();
      expect(spy).toHaveBeenCalledTimes(1);
      // expect(spyDefaultFreq).toHaveBeenCalledTimes(1);
      expect(component.cronJobsForm.value).toEqual(expected);
    }));

  it('should not call onChange if component values are patched', fakeAsync(() => {
    testFixture.detectChanges();
    const spy = spyOn(component, 'onChange').and.callThrough();

    tick();
    spy.calls.reset();
    component.writeValue('* * * * *');
    tick();
    testFixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  }));

  it('should set corect data for select options', fakeAsync(() => {
    testFixture.detectChanges();

    tick();
    expect(component.baseFrequencyData.length).toBeTruthy();
    expect(component.daysOfMonthData.length).toBeTruthy();
    expect(component.daysOfWeekData.length).toBeTruthy();
    expect(component.daysOfWeekData.length).toBeTruthy();
    expect(component.monthsData.length).toBeTruthy();
    expect(component.hoursData.length).toBeTruthy();
    expect(component.minutesData.length).toBeTruthy();
  }));

  it('should set corect base freq data for select options', fakeAsync(() => {

    testComponent.cronConfig = {
      ...testComponent.cronConfig,
      option: { minute: false },
    };

    testFixture.detectChanges();
    const expected = ['Please select', 'Hour', 'Day', 'Week', 'Month', 'Year'];
    tick();
    expect(Object.values(component.baseFrequencyData).map(x => x.label)).toEqual(expected);

  }));

  it('should on init patch cronJobsFrom with default value', fakeAsync(() => {
    testFixture.detectChanges();
    const spy = spyOn(component.cronJobsForm, 'patchValue').and.callThrough();
    const expected = posixService.getDefaultFrequenceWithDefault();

    tick();
    expect(spy).toHaveBeenCalledWith(expected);
  }));

  it('should call cronService.fromCron and patchValue on writeValue call with correct data', fakeAsync(() => {
    testFixture.detectChanges();
    const spy = spyOn(component.cronJobsForm, 'patchValue').and.callThrough();
    const expected = posixService.getDefaultFrequenceWithDefault();

    tick();
    spy.calls.reset();
    component.writeValue('* * * * *');
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).not.toHaveBeenCalledWith(expected);
  }));

  it('should not call cronService.fromCron and call patchValue with default data on writeValue call with empty data', fakeAsync(() => {
    testFixture.detectChanges();
    const spy = spyOn(component.cronJobsForm, 'patchValue').and.callThrough();
    const expected = posixService.getDefaultFrequenceWithDefault();

    tick();
    component.writeValue('* * * * *');
    tick();
    spy.calls.reset();
    component.writeValue('');
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expected);
  }));

  it('should register onChange callback', fakeAsync(() => {
    testFixture.detectChanges();

    tick();
    expect(component.onChange).not.toBeUndefined();
  }));

  it('should set disable state on cronJobsForm on setDisabledState call', fakeAsync(() => {
    testFixture.detectChanges();

    tick();
    component.setDisabledState(true);
    tick();

    expect(component.cronJobsForm.disabled).toBeTruthy();
    expect(component.isDisabled).toBeTruthy();

    component.setDisabledState(false);
    tick();

    expect(component.cronJobsForm.disabled).toBeFalsy();
    expect(component.isDisabled).toBeFalsy();
  }));

  it('should return default frequency object on getDefaultFrequency call', fakeAsync(() => {
    testFixture.detectChanges();

    tick();
    const expected = {
      baseFrequency: 0, daysOfWeek: [0], daysOfMonth: [1], months: [1], hours: [0], minutes: [0]
    };

    const result = posixService.getDefaultFrequenceWithDefault();

    expect(result).toEqual(expected);
  }));

  it('should return if validation state on getIsValid call and call getValid if validate.validate is set to true', fakeAsync(() => {
    testFixture.detectChanges();
    const spy = spyOn(component, 'getValid').and.callThrough();

    tick();
    spy.calls.reset();
    const result = component.getIsValid();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  }));

  it('should return if validation state on getIsInvalid call and call getValid if validate.validate is set to true', fakeAsync(() => {
    testFixture.detectChanges();
    const spy = spyOn(component, 'getValid').and.callThrough();

    tick();
    spy.calls.reset();
    const result = component.getIsInvalid();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toBeFalsy();
  }));

  it('should return false if validation state equals to false on getIsValid call ' +
    'and no call getValid if validate.validate is false', fakeAsync(() => {
      testComponent.cronValidate = {
        validate: false
      };
      testFixture.detectChanges();
      const spy = spyOn(component, 'getValid').and.callThrough();

      tick();
      spy.calls.reset();
      const result = component.getIsValid();

      expect(spy).not.toHaveBeenCalled();
      expect(result).toBeFalsy();
    }));

  it('should return false if validation state equals to false on getIsInvalid call ' +
    'and no call getIsInvalid if validate.validate is false', fakeAsync(() => {
      testComponent.cronValidate = {
        validate: false
      };
      testFixture.detectChanges();
      const spy = spyOn(component, 'getValid').and.callThrough();

      tick();
      spy.calls.reset();
      const result = component.getIsInvalid();

      expect(spy).not.toHaveBeenCalled();
      expect(result).toBeFalsy();
    }));

  it('should return formControl.valid if formControl is defined', fakeAsync(() => {
    testFixture.detectChanges();

    tick();
    expect(component.getValid()).toBeTruthy();
  }));

  it('should return isValid if formControl is not defined', fakeAsync(() => {
    const secComponent = testFixture.debugElement.queryAll(By.css('cron-jobs'))[1].componentInstance;
    testFixture.detectChanges();

    tick();
    expect(secComponent.getValid()).toBeTruthy();
  }));

  it('should on registerOnTouched set onTouched', () => {
    const spy = createSpy('spy');

    component.registerOnTouched(spy);

    expect(component.onTouched).toBeDefined();
  });

  it('should on registerOnChange set onChange', () => {
    const spy = createSpy('spy');

    component.registerOnChange(spy);

    expect(component.onChange).toBeDefined();
  });

  it('should on onBlur() call onTouched', () => {
    const spy = createSpy('spy');
    component.registerOnTouched(spy);

    component.onBlur();

    expect(spy).toHaveBeenCalled();
  });

  describe('integration', () => {
    let fixture: ComponentFixture<CronJobsComponent>;
    let orgComponent: CronJobsComponent;
    let de: DebugElement;
    const spyOnChange = createSpy('spyOnChange');
    const spyOnTouched = createSpy('spyOnTouched');

    beforeEach(() => {
      fixture = TestBed.createComponent(CronJobsComponent);
      orgComponent = fixture.componentInstance;
      spyOnChange.calls.reset();
      orgComponent.registerOnChange(spyOnChange);
      orgComponent.registerOnTouched(spyOnTouched);
      de = fixture.debugElement;
      fixture.detectChanges();
    });

    it('should on start render baseFrequency select', fakeAsync(() => {
      tick();

      const result = de.queryAll(By.css('select'));

      expect(result.length).toEqual(1);
      expect(result[0].attributes.formControlName).toEqual('baseFrequency');
    }));

    it('should render correct selects on baseFrequency set to 1', fakeAsync(() => {
      tick();
      orgComponent.cronJobsForm.get('baseFrequency').setValue('1');
      fixture.detectChanges();

      const result = de.queryAll(By.css('select'));

      expect(result.length).toEqual(1);
      expect(result[0].attributes.formControlName).toEqual('baseFrequency');
    }));

    it('should render correct selects on baseFrequency set to 2', fakeAsync(() => {
      tick();
      orgComponent.cronJobsForm.get('baseFrequency').setValue('2');
      fixture.detectChanges();

      const result = getFormControlNames(de.queryAll(By.css('select')));
      const expected = ['baseFrequency', 'minutes'];

      expect(result.length).toEqual(2);
      expect(result).toEqual(expected);
    }));

    it('should render correct selects on baseFrequency set to 3', fakeAsync(() => {
      tick();
      orgComponent.cronJobsForm.get('baseFrequency').setValue('3');
      fixture.detectChanges();

      const result = getFormControlNames(de.queryAll(By.css('select')));
      const expected = ['baseFrequency', 'hours', 'minutes'];

      expect(result.length).toEqual(3);
      expect(result).toEqual(expected);
    }));

    it('should render correct selects on baseFrequency set to 4', fakeAsync(() => {
      tick();
      orgComponent.cronJobsForm.get('baseFrequency').setValue('4');
      fixture.detectChanges();

      const result = getFormControlNames(de.queryAll(By.css('select')));
      const expected = ['baseFrequency', 'daysOfWeek', 'hours', 'minutes'];

      expect(result.length).toEqual(4);
      expect(result).toEqual(expected);
    }));

    it('should render correct selects on baseFrequency set to 5', fakeAsync(() => {
      tick();
      orgComponent.cronJobsForm.get('baseFrequency').setValue('5');
      fixture.detectChanges();

      const result = getFormControlNames(de.queryAll(By.css('select')));
      const expected = ['baseFrequency', 'daysOfMonth', 'hours', 'minutes'];

      expect(result.length).toEqual(4);
      expect(result).toEqual(expected);
    }));

    it('should render correct selects on baseFrequency set to 6', fakeAsync(() => {
      tick();
      orgComponent.cronJobsForm.get('baseFrequency').setValue('6');
      fixture.detectChanges();

      const result = getFormControlNames(de.queryAll(By.css('select')));
      const expected = ['baseFrequency', 'daysOfMonth', 'months', 'hours', 'minutes'];

      expect(result.length).toEqual(5);
      expect(result).toEqual(expected);
    }));

    it('should render no bootstrap them on config.bootstrap set to false', fakeAsync(() => {
      tick();
      orgComponent.config = {
        ...orgComponent.config,
        bootstrap: false
      };

      tick();
      fixture.detectChanges();

      const result = de.query(By.css('.cron-wrap')).nativeElement;
      expect(result).toBeTruthy();
    }));

  });
});

import { Component, OnInit } from "@angular/core";
import {
  CronJobsConfig,
  CronJobsValidationConfig,
} from "./lib/contracts/contracts";
import { UntypedFormControl, Validators } from "@angular/forms";

@Component({
  selector: "cron-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  freq = "";
  freqQuartz = "0 20 3 2 3 ?";
  freqCron = "35 4 4 3 *";

  freqSec = "";
  freqSecCron = "35 4 4 3 *";
  freqSecQuartz = "0 20 3 2 3 ?";

  freqSingle = "";
  freqSingleCron = "35 4 4 3 *";
  freqSingleQuartz = "0 20 3 2 3 ?";

  freqControl: UntypedFormControl;
  freqSingleControl: UntypedFormControl;

  cronConfig: CronJobsConfig = {
    multiple: true,
    quartz: true,
    bootstrap: true,
  };

  cronSingleConfig: CronJobsConfig = {
    ...this.cronConfig,
    multiple: false,
  };

  cronValidate: CronJobsValidationConfig = {
    validate: true,
  };

  constructor() {}

  ngOnInit() {
    this.freqControl = new UntypedFormControl();
    this.freqControl.setValue(this.freqSec);
    this.freqControl.setValidators([Validators.required]);
    this.freqControl.valueChanges.subscribe((value) => (this.freqSec = value));

    this.freqSingleControl = new UntypedFormControl();
    this.freqSingleControl.setValue(this.freqSingle);
    this.freqSingleControl.setValidators([Validators.required]);
    this.freqSingleControl.valueChanges.subscribe(
      (value) => (this.freqSingle = value)
    );
  }

  reset() {
    this.freq = "";
    this.freqSec = "";
    this.freqSingle = "";
    this.setFormControl();
  }

  set() {
    if (this.cronConfig.quartz) {
      this.freq = this.freqQuartz;
      this.freqSec = this.freqSecQuartz;
      this.freqSingle = this.freqSingleQuartz;
    } else {
      this.freq = this.freqCron;
      this.freqSec = this.freqSecCron;
      this.freqSingle = this.freqSingleCron;
    }
    this.setFormControl();
  }

  toggleService() {
    this.cronConfig = {
      ...this.cronConfig,
      quartz: !this.cronConfig.quartz,
    };
    this.cronSingleConfig = {
      ...this.cronSingleConfig,
      quartz: !this.cronSingleConfig.quartz,
    };
    this.set();
  }
  toggleBootstrap() {
    this.cronConfig = {
      ...this.cronConfig,
      bootstrap: !this.cronConfig.bootstrap,
    };
    this.cronSingleConfig = {
      ...this.cronSingleConfig,
      bootstrap: !this.cronSingleConfig.bootstrap,
    };
  }

  setFormControl() {
    setTimeout(() => {
      this.freqControl.setValue(this.freqSec);
      this.freqSingleControl.setValue(this.freqSingle);
    });
  }

  toggleValidate() {
    this.cronValidate = {
      ...this.cronValidate,
      validate: !this.cronValidate.validate,
    };
  }
}

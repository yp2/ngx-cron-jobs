import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CronJobsComponent } from './cron-jobs/cron-jobs.component';
import { DataService } from './services/data.service';
import { PosixService } from './services/posix.service';
import { QuartzService } from './services/quartz.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CronJobsComponent
  ],
  exports: [
    CronJobsComponent
  ],
  providers: [
    DataService,
    PosixService,
    QuartzService
  ]
})
export class CronJobsModule {
}

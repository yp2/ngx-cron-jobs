# cron-selection
Angular 2 version of angular-cron-jobs (http://angular-cron-jobs.github.io/angular-cron-jobs)


# angular-cron-jobs
UI Component For Creating Cron Job Syntax To Send To Server in Angular 2

## [Demo](http://angular-cron-jobs.github.io/angular-cron-jobs/#/)
## Installation

For the moment, clone the repo and add it in your project. 

## Use:

Include the component in your application, i.e, in your `app.module.ts`:


```typescript

import { CronSelectionComponent } from './cron-selection/cron-selection.component';

....

  declarations: [
    AppComponent,
    DashboardComponent,
    HeroSearchComponent,
    HeroesComponent,
    HeroDetailComponent,
    CronSelectionComponent
  ],
  
```
  

Insert the directive where you would like it to appear in your application:

```html
<my-cron-selection [(ngModel)]="hero.frequency" [cronJobConfig]="cronJobConfig" ngDefaultControl></my-cron-selection>
```

Where ngModel is the property to save the crojob syntax, and cronJobConfig is a variable added to the parent component with different properties to the object.
So, for example, in parent component I have:

```typescript
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here
  cronJobConfig: Object;
  
```

And in the mode where I'm gonna store the syntax:

```typescript
export class Hero {
  id: number;
  name: string;
  frequency: string;
}
```

For example, a job selected to run every month on the 11th at 4:10 AM would output the follow:

    '10 4 11 * *'

as a string.

## Configuration:

The directive takes an attribute of `config`

```html
  <my-cron-selection [(ngModel)]="hero.frequency" [cronJobConfig]="cronJobConfig" ngDefaultControl></my-cron-selection>
```    
### Options

This is an object in your controller you can use to remove options from the user.  For example if you would like the user to be able to set Minute, Hour, and Day but not Week, Month, and Year you would create the following object in your controller:

Currently, from the angular 1 project, only quartz syntax option is available. Currently working to add other config options.


How you initialize the object? In parent component:

```typescript
  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute) {
    this.cronJobConfig = {
      quartz: true
    };
  }

```

##Contributors

From angular 1 project

[@wowo](https://github.com/wowo)

[@immertreu](https://github.com/immertreu)

[@TSteele27](https://github.com/TSteele27)

[@DmitryEfimenki](https://github.com/DmitryEfimenko)

From angular 2 project

[@rvalenciano](https://github.com/rvalenciano)


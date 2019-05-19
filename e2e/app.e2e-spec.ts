import { AppPage } from './app.po';

describe('angular2-cron-jobs App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Demo ngx-cron-jobs');
  });
});

import { ProDirectFootballPage } from './app.po';

describe('pro-direct-football App', () => {
  let page: ProDirectFootballPage;

  beforeEach(() => {
    page = new ProDirectFootballPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('pdf works!');
  });
});

import { MbrokerPage } from './app.po';

describe('mbroker App', () => {
  let page: MbrokerPage;

  beforeEach(() => {
    page = new MbrokerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

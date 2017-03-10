import { SmstFrontendAdminPage } from './app.po';

describe('smst-frontend-admin App', () => {
  let page: SmstFrontendAdminPage;

  beforeEach(() => {
    page = new SmstFrontendAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

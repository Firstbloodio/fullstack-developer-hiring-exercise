/**
 * To debug these test in Visual Studio Code
 * - Set Auto attach: On in VS Code command palette
 * - npm run e2e-debug
 *
 * https://github.com/microsoft/vscode-recipes/tree/master/Angular-CLI#debug-end-to-end-tests
 */

import axios from 'axios';
import { browser, logging, element, by, ExpectedConditions } from 'protractor';
import { fillField } from './utils';

describe('End-to-end tests for full stack exercise', () => {

  const backendURL = "http://localhost:3000";

  /**
   * Check that backend is up and running in a testing mode
   */
  async function checkBackend() {
    const response = await axios.get(backendURL + '/testing');
    expect(response.data).toEqual('enabled');
  }

  /**
   * Removes all user data and creates the default test user.
   */
  async function resetTestDatabase() {
    const response = await axios.post(backendURL + '/testing/reset');
    expect(response.data).toEqual('OK');
  }

  beforeEach(async () => {
    checkBackend();
    resetTestDatabase();
  });

  it('should login with valid username and password', async () => {
    await browser.get(browser.baseUrl);
    // See testing.controller.ts
    fillField('login', 'testing@exampe.com');
    fillField('password', 'test123');
    await element(by.css('.btn-sign-in')).click();
    expect(element(by.css('.span-user-full-name')).getText()).toBe(name);
  });

  it('should give an error for missing user', async () => {
    await browser.get(browser.baseUrl);
  });

  it('should give an error for missing password', async () => {
    await browser.get(browser.baseUrl);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

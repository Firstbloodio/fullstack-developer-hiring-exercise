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
    await fillField('login', 'testing@example.com');
    await fillField('password', 'test123');
    await element(by.css('.btn-sign-in')).click();
    const dropdown = element(by.css('.dropdown-signed-in'));
    expect(dropdown.isPresent()).toBe(true);
  });

  it('should give an error for missing form field', async () => {
    await browser.get(browser.baseUrl);
    fillField('login', 'testing@example.com');
    await element(by.css('.btn-sign-in')).click();
    // Machine readable error is passed as data attribute
    const errorCategory = await element(by.css('.error-login')).getAttribute('data-error-class');
    expect(errorCategory).toEqual('NoUser');
  });

  it('should give an error for bad password', async () => {
    await browser.get(browser.baseUrl);
    await fillField('login', 'testing@example.com');
    await fillField('password', 'wrong');
    await element(by.css('.btn-sign-in')).click();
    // Machine readable error is passed as data attribute
    const errorCategory = await element(by.css('.error-login')).getAttribute('data-error-class');
    expect(errorCategory).toEqual('InvalidPassword');
  });

  it('should display user information in dashboard', async () => {
    await browser.get(browser.baseUrl);
    await fillField('login', 'testing@example.com');
    await fillField('password', 'test123');
    await element(by.css('.btn-sign-in')).click();
    // Check we are on the right page
    const headingDashboard = element(by.css('#heading-dashboard'));
    expect(headingDashboard.isDisplayed()).toBe(true);
    // Grab data from table
    const email = await element(by.css('#user-email')).getText()
    expect(email).toEqual('testing@example.com');
    const displayName = await element(by.css('#user-display-name')).getText()
    expect(displayName).toEqual('Test-Moo');

  });

  it('should log out', async () => {
    await browser.get(browser.baseUrl);
    // See testing.controller.ts
    await fillField('login', 'testing@example.com');
    await fillField('password', 'test123');
    await element(by.css('.btn-sign-in')).click();
    // Navigate to log out through menu
    const dropdown = element(by.css('.dropdown-signed-in'));
    await dropdown.click();
    const logout = element(by.css('.dropdown-item-logout'));
    await logout.click();
    // Back to the home screen after logout
    const headingHome = element(by.css('.heading-welcome'));
    expect(headingHome.isDisplayed()).toBe(true);
  });

  it('should register account with valid values', async () => {
    await browser.get(browser.baseUrl);
    await element(by.css('.signup')).click();
    await fillField('login', 'oreofeolurin@gmail.com');
    await fillField('displayName', 'Oreofe Olurin');
    await fillField('phone', '+2348189681252');
    await fillField('password', 'password');
    await element(by.css('.btn-register')).click();
    const alert = element(by.css('.account-created-success'));
    expect(alert.isPresent()).toBe(true);
  })

  it('should not register the same email twice', async () => {
    await browser.get(browser.baseUrl);
    await element(by.css('.signup')).click();
    await fillField('login', 'testing@example.com');
    await fillField('displayName', 'Oreofe Olurin');
    await fillField('phone', '+2348189681252');
    await fillField('password', 'password');
    await element(by.css('.btn-register')).click();
    const alert = element(by.css('.error-login'));
    expect(alert.isPresent()).toBe(true);
  })

  it('should not register with invalid password', async () => {
    await browser.get(browser.baseUrl);
    await element(by.css('.signup')).click();
    await fillField('login', 'oreofeolurin@gmail.com');
    await fillField('displayName', 'Oreofe Olurin');
    await fillField('phone', '+2348189681252');
    await fillField('password', 'pass');
    await element(by.css('.btn-register')).click();
    const alert = element(by.css('.error-login'));
    expect(alert.isPresent()).toBe(true);
  })


  it('should not register with invalid phone', async () => {
    await browser.get(browser.baseUrl);
    await element(by.css('.signup')).click();
    await fillField('login', 'oreofeolurin@gmail.com');
    await fillField('displayName', 'Oreofe Olurin');
    await fillField('phone', 'hdhj-j6812-52dnnnn');
    await fillField('password', 'password');
    await element(by.css('.btn-register')).click();
    const alert = element(by.css('.error-login'));
    expect(alert.isPresent()).toBe(true);
  })


  it('should register with un-normalized phone number and be normalized in dashboard', async () => {
    await browser.get(browser.baseUrl);

    // Procced to register page and register
    await element(by.css('.signup')).click();
    await fillField('login', 'oreofeolurin@gmail.com');
    await fillField('displayName', 'Oreofe Olurin');
    await fillField('phone', '+234-818-9681-252');
    await fillField('password', 'password');
    await element(by.css('.btn-register')).click();

    //Proceed to login
    await element(by.css('.login-btn')).click();
    await fillField('login', 'oreofeolurin@gmail.com');
    await fillField('password', 'password');
    await element(by.css('.btn-sign-in')).click();

    // Check we are on the right page
    const headingDashboard = element(by.css('#heading-dashboard'));
    expect(headingDashboard.isDisplayed()).toBe(true);

    // Check if phone numbers are normalized
    const phone = await element(by.css('#user-phone')).getText()
    expect(phone).toEqual('+2348189681252');


  })

  afterEach(async () => {
  });
});

import { browser, logging, element, by, ExpectedConditions } from 'protractor';

// https://stackoverflow.com/questions/50970567/more-efficient-way-to-fill-out-my-form-in-protractor/50970938
export async function fillInput(el, text) {
    await el.click()
    await el.clear();
    await el.sendKeys(text);
}

/**
 * Fills a named field on a form.
 */
export async function fillField(name, text) {
    const el = element(by.css(`input[name='${name}']`));    
    expect(el.isPresent()).toBe(true);
    fillInput(el, text);
}

/**
 * Angular Material inputs are named specially and they do not honour name attribute.
 * 
 * <input _ngcontent-ocw-c5="" class="mat-input-element mat-form-field-autofill-control cdk-text-field-autofill-monitored ng-pristine ng-invalid ng-touched" formcontrolname="email" matinput="" placeholder="example@example.com" ng-reflect-name="email" ng-reflect-placeholder="example@example.com" id="mat-input-0" aria-invalid="true" aria-required="false">
 * 
 */
export async function fillMaterialField(name, text) {
    const selector = by.css(`input[formcontrolname='${name}']`);
    const el = element(selector);    
    expect(await el.isPresent()).toBe(true);
    await fillInput(el, text);
}
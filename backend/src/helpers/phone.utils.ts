import { APISafeException } from "src/apiexception";

// Require `PhoneNumberFormat`.
const libphonenumber = require('google-libphonenumber');

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

/**
 * Helper  class to make working  with google-libphonenumber easier
 * https://github.com/ruimarinho/google-libphonenumber
 */
export class PhoneUtils {
    static PFN: any = libphonenumber.PhoneNumberFormat;

    static isValidNumber(phone: string, countryCode = '') {
        const number = phoneUtil.parse(phone, countryCode);
        return phoneUtil.isValidNumber(number);
    }

    static format(phone: string, countryCode = '', format = PhoneUtils.PFN.E164) {
        try {
            const number = phoneUtil.parse(phone, countryCode);
            return phoneUtil.format(number, format);
        } catch (e) {
            throw new APISafeException('Phone number must be valid');
        }
    }
}
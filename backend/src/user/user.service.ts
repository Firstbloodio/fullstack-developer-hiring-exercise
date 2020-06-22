import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Validator, validateOrReject, isEmail, min, minLength } from "class-validator";
import { strict as assert } from 'assert';
import { APISafeException, ValidationAPIException } from '../apiexception';
import { UserOwnInfoDto } from './user.dto';
import { PhoneUtils } from 'src/helpers/phone.utils';
import { MIN_PASSWORD_LENGHT } from 'src/helpers/constants';

// Some common error conditions
class UserExists extends APISafeException {
}

class BadEmailError extends APISafeException {
}

class BadPasswordError extends APISafeException {
}

class BadDisplayNameError extends APISafeException {
}

class BadPhoneError extends APISafeException {
}

class ConfirmationEmailExpiredError extends APISafeException {
}

class ConfirmationEmailWrongToken extends APISafeException {
}

class AlreadyConfirmedEmail extends APISafeException {
}

class NoSuchUserError extends APISafeException {
}

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
  }

  /**
   * Get user by its emai.
   *
   * Consider all users, even those that cannot log in yet.
   *
   * @param email
   */
  async findOnePending(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { pendingEmail: email } });
  }

  /**
   * Reflect users own info back to him/her
   */
  async getProfileById(publicId: string): Promise<UserOwnInfoDto> {
    const user = await this.userRepository.findOne({ where: { publicId: publicId } });

    if(!user) {
      throw new NoSuchUserError(`No user with public id ${publicId}`);
    }

    return {
      publicId: user.publicId,
      displayName: user.displayName,
      email: user.confirmedEmail,
      phone: user.phone,
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Register a new email based user to the service
   *
   * Throws various APISafeExceptions on errors.
   *
   * @param email User's email
   * @param displayName Gamer tag the user wants to use
   * @param password User's initial password
   */
  async register(email: string, displayName: string, password: string, phone: string): Promise<User> {

    if(!email) {
      throw new BadEmailError(`Email must be given`);
    }

    if(!password) {
      throw new BadPasswordError(`Initial password must be given`);
    }

    if(!minLength(password, MIN_PASSWORD_LENGHT)) {
      throw new BadPasswordError(`Password length be greater than 6`);
    }

    if(!displayName) {
      throw new BadDisplayNameError(`Initial displayName missing`);
    }

    if(!phone) {
      throw new BadPhoneError(`Initial phone must be given`);
    }

    email = email.toLowerCase();

    let existing = await this.userRepository.findOne({pendingEmail: email});
    if(existing) {
      throw new UserExists(`The user with email ${email} exists`)
    }

    existing = await this.userRepository.findOne({displayName});
    if(existing) {
      throw new UserExists(`The user with name ${displayName} exists`)
    }

    existing = await this.userRepository.findOne({phone});
    if(existing) {
      throw new UserExists(`The user with name ${phone} exists`)
    }

    const u = new User();
    u.displayName = displayName;
    u.pendingEmail = email;
    u.phone = phone;
    u.phone = PhoneUtils.format(phone);
    u.emailConfirmationRequestedAt = new Date();

    // TODO: Add a crypto secure user readable random token
    // https://stackoverflow.com/a/47496558/315168
    u.emailConfirmationToken = [...Array(16)].map(() => Math.random().toString(36)[2]).join('');

    // Set the initial password
    await u.resetPassword(password);
    assert(u.passwordHash, 'Setting initial password failed');

    // Run application level validators like IsEmail()
    try {
      await validateOrReject(u);
    } catch(e) {
      // Convert to friendlier exception
      throw ValidationAPIException.createFromValidationOutput(e);
    }

    // We do not have any email out integration in this execrise
    await this.userRepository.save(u);
    return u;
  }

  /**
   * Check if the confirmed email alreaddy is there
   */
  async checkConfirmedEmail(email: string) {
    const existing = await this.userRepository.findOne({confirmedEmail: email});
    if(existing) {
      throw new AlreadyConfirmedEmail(`The user with email ${email} is already confirmed`)
    }
  }

  // Make user to confirm their account on registration
  async confirmEmail(email: string, token: string, now_:Date = null) {

    const validator = new Validator();
    email = email.toLowerCase();

    assert(isEmail(email));

    // Allow override time for testing
    if(!now_) {
        now_ = new Date();
    }

    await this.checkConfirmedEmail(email);

    const record = await this.userRepository.findOneOrFail({pendingEmail: email})

    // Shitscript is shit, standard datetime sucks and no arithmetic methods
    if(now_ > new Date(record.emailConfirmationRequestedAt.getTime() + User.EMAIL_CONFIRMATION_TIMEOUT_SECONDS)) {
      throw new ConfirmationEmailExpiredError("Confirmation email was expired.");
    }

    if(token != record.emailConfirmationToken) {
      throw new ConfirmationEmailWrongToken("Invalid confirmation.");
    }

    record.confirmedEmail = record.pendingEmail;
    record.emailConfirmationCompletedAt = now_;
    record.emailConfirmationToken = null;

    // Run application level validators like IsEmail()
    try {
      await validateOrReject(record);
    } catch(e) {
      // Convert to friendlier exception
      throw ValidationAPIException.createFromValidationOutput(e);
    }

    this.userRepository.save(record);
  }

  /**
   * Shortcut method to confirm email addresses without a good token.
   * Use in testing - does not do error checking.
   *
   */
  async confirmEmailForced(email: string, now_:Date = null): Promise<User> {
    // Allow override time for testing
    if(!now_) {
        now_ = new Date();
    }

    await this.checkConfirmedEmail(email);

    const record = await this.userRepository.findOneOrFail({pendingEmail: email})

    assert(record.passwordHash, 'Password missing when confirming email');
    record.confirmedEmail = record.pendingEmail;
    record.emailConfirmationCompletedAt = now_;
    record.emailConfirmationToken = null;

    // Run application level validators like IsEmail()
    try {
        await validateOrReject(record);
    } catch(e) {
        // Convert to friendlier exception
        throw ValidationAPIException.createFromValidationOutput(e);
    }

    await this.userRepository.save(record);
    return record;
}

validatePhone() {
  const PNF = require('google-libphonenumber').PhoneNumberFormat;
  
  // Get an instance of `PhoneNumberUtil`.
  const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
}

}

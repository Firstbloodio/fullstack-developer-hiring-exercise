import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { APISafeException } from '../apiexception';



interface LoginDetails {
  email: string;
  password: string;
}

// Some common error conditions
class NoUser extends APISafeException {
}

class InvalidPassword extends APISafeException {
}

class CannotLogIn extends APISafeException {
}


/**
 * Simple JWT token based authentication service from NestJS tutorial.
 *
 * https://docs.nestjs.com/techniques/authentication
 */
@Injectable()
export class AuthService {

  constructor(private userService: UserService, private jwtService: JwtService) {}

  /**
   * Check if the user can login.
   *
   * Throw various exception on different error conditions.
   *
   * @param email
   * @param pass
   */
  async validateUser(email: string, pass: string): Promise<User> {

    if(!email || !pass) {
      throw new NoUser(`Email address or password missing`);
    }

    const user: User = await this.userService.findOnePending(email);

    if(!user) {
      throw new NoUser(`No user for email address ${email}`);
    }

    if(!user.canLogIn()) {
      throw new CannotLogIn(`The email address ${email} has not been verified or the user log in is disabled`);
    }

    const match = await user.isRightPassword(pass);
    if(match) {
      return user;
    } else {
      throw new InvalidPassword(`Incorrect password`);
    }
  }

  /**
   * Give user a JWT session token
   *
   */
  async login(details: LoginDetails) {

    const user = await this.validateUser(details.email, details.password);

    // What goes into JWT token
    const payload = { username: user.confirmedEmail, sub: user.publicId };

    return {
      accessToken: this.jwtService.sign(payload),
      userDetails: {
        email: user.confirmedEmail,
        displayName: user.displayName,
        phone: user.phone,
        publicId: user.publicId,
      }
    };
  }
}
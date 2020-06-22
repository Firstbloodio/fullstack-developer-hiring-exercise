import { Entity, PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn, ValueTransformer } from 'typeorm';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { strict as assert } from 'assert';

export const COLUMN_NULL_VALUE = 'NULL_VALUE';

/**
 * Typeorm Transformer class to handle records without phone pre-migration
 * (before `NOT_NULL` phone  column was added)
 */
class ColumnNullValueTransformer implements ValueTransformer {
  to(value: string): string {
    return value;
  }

  from(value: string): string {
    return value === COLUMN_NULL_VALUE ? null : value;
  }
}

/**
 * Store site user details in a database.
 *
 * Support safe email verification and password reset mechanisms.
 */
@Entity()
export class User {

  // How long we wait for the user to click confirmation email when creating a new account
  static EMAIL_CONFIRMATION_TIMEOUT_SECONDS = 3 * 24 * 3600;

  // How many times we rerun hasher to make password cracking slower
  static SALT_ROUNDS = 10;

  // This is what we use internally as a foreign key, but never expose to the public because leaking user counts is
  // a company trade secrets issue
  // (Running counter keys make data more local and faster to access)
  @PrimaryGeneratedColumn()
  id: number;

  // Nice columns for internal statistics and diagnostics
  // We assume all servers tick UTC, but we always preserve timezone for
  // our sanity when something gets messy
  @CreateDateColumn({ type: 'timestamptz', default: () => 'LOCALTIMESTAMP' })
  createdAt: Date;

  // Nice columns for internal statistics and diagnostics
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'LOCALTIMESTAMP' })
  updatedAt: Date;

  // Already refer users by this id when in the APIs .
  // (Randomized public ids make data exposure safer)
  @Column({ unique: true })
  @Generated("uuid")
  publicId: string;

  // User's chosen nick, settable by the user
  @Column({ length: 50, unique: true })
  displayName: string;

  // User's phone number, settable by the user
  @Column({ length: 50, unique: true, transformer: new ColumnNullValueTransformer() })
  @IsPhoneNumber('ZZ')
  phone: string;

  // Set after the email verification completes
  @Column({ length: 50, nullable: true, unique: true })
  @IsOptional()
  @IsEmail()
  confirmedEmail: string;

  // Set on the sign up / email change
  @Column({ length: 50, nullable: false })
  @IsEmail()
  pendingEmail: string;

  // Set after the email verification completes
  @Column({ length: 16, nullable: true, unique: true })
  emailConfirmationToken: string;

  // When the user registerd / requested email change
  @Column({ type: 'timestamptz', nullable: false })
  emailConfirmationRequestedAt: Date;

  // When the user registerd / requested email change
  @Column({ type: 'timestamptz', nullable: true })
  emailConfirmationCompletedAt: Date;

  // Set when user resets password, when user is forcefully banned, etc.
  // If securityOperationPerformedAt > session created at, terminate the user session
  @Column({ type: 'timestamptz', default: () => 'LOCALTIMESTAMP' })
  securityOperationPerformedAt: Date;

  // A hashed password - can be null for users created from OAuth sourced like Facebook
  @Column({ nullable: true })
  passwordHash: string;

  /**
   * Can this user login?
   *
   * The user cannot login until the verification link has been confirmed.
   */
  canLogIn(): boolean {
    return (this.emailConfirmationCompletedAt !== null) && (this.passwordHash !== null);
  }

  /**
   * Sets the user password and resets the existing logged in session.
   */
  async resetPassword(newPassword: string): Promise<void> {
    // https://www.npmjs.com/package/bcrypt#with-promises
    const hash = await bcrypt.hash(newPassword, User.SALT_ROUNDS);
    assert(hash, "bcrypt did not give a password hash");
    this.passwordHash = hash;
    // Force user to log out from existing sessions
    this.securityOperationPerformedAt = new Date();
  }

  async isRightPassword(password: string): Promise<boolean> {
    assert(password, "Password missing");
    assert(this.passwordHash, "Password hash missing");
    const match = await bcrypt.compare(password, this.passwordHash);
    return match;
  }

}
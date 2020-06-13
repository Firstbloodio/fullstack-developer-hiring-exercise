import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from './models';


// For inspiration, please check https://github.com/cornflourblue/angular-8-registration-login-example
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User | null>;

  public currentUser: Observable<User | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Retrieves the user data based on the session cookie.
   */
  fetchStoredUser(): void {
    this.updateUserData(null);
  }

  /**
   * Remember the session id in a local storage
   *
   * @param sessionId Whatever string the backend uses to identify the session
   */
  saveSession(sessionId): void {
    window.localStorage.setItem("sessionId", sessionId);
  }

  /**
   * Registers a new user and sets up the session immediately.
   */

  register({email, name, phoneNumber, password}): User {
    return null;
  }

  /**
   * We got user data from the server sdie
   * @param userData
   */
  updateUserData(userData: any) {
    this.currentUserSubject.next(userData);
  }

  logout() {
    localStorage.removeItem('sessionId');
    this.currentUserSubject.next(null);
  }
}

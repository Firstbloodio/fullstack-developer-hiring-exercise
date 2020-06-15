import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './models';
import { NGXLogger } from 'ngx-logger';


// For inspiration, please check https://github.com/cornflourblue/angular-8-registration-login-example
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User | null>;

  public currentUser: Observable<User | null>;

  private authToken: string;

  constructor(private http: HttpClient, private logger: NGXLogger) {
    this.currentUserSubject = new BehaviorSubject<User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Retrieves the user data based on the session cookie.
   */
  async fetchStoredUser(): Promise<void> {

    // See if this browser has logged in before
    this.authToken = window.localStorage.getItem("jwtAuthToken");

    if(this.authToken) {
      this.logger.info("Getting logged in user with token", this.authToken);
      let userData;
      try {
        userData = await this.http.get('/api/userInfo').toPromise();
      } catch(e) {
        // Consider any error here as authentication token failure
        // TODO: Backend needs to have fine grained error messages in HTTP 401
        this.logout();
        return;
      }
      this.logger.info("Got logged in user data", userData);
      this.updateUserData(userData);
    } else {
      // Start with no user
      this.updateUserData(null);
    }
  }

  /**
   * Get logged in user auth token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Remember the session id in a local storage
   *
   * @param sessionId Whatever string the backend uses to identify the session
   */
  saveSession(sessionId): void {
    window.localStorage.setItem("jwtAuthToken", sessionId);
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

  /**
   * Set user as a logged in
   * @param jwtToken
   * @param userData
   */
  setLoggedIn(jwtToken: string, userData: any) {
    this.currentUserSubject.next(userData);
    window.localStorage.setItem("jwtAuthToken", jwtToken);
  }

  logout() {
    localStorage.removeItem('jwtAuthToken');
    this.updateUserData(null);
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { of } from 'rxjs';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

enum LoginState {

  // User editing the login form
  onForm,

  // Waiting the login API
  waitingApi,
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  // Login form fields
  loginDetails = {
    email: "",
    password: "",
  };

  // Current login state
  state: LoginState = LoginState.onForm;

  // Expose to template
  states = LoginState;

  // Validation error from the server-side
  errorMessage: string;

  // Expose for E2E testing
  errorClass: string;

  constructor(private http: HttpClient, private logger: NGXLogger, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Login the user
   */
  async login() {
    this.state = LoginState.waitingApi;
    this.logger.debug("Logging in with details", this.loginDetails);

    try {
      const reply = await this.http.post('/api/login', this.loginDetails).toPromise() as any;
      this.logger.debug("Got reply", reply);
      this.userService.setLoggedIn(reply.accessToken, reply.userDetails);

      // Restart from the home as a logged in user
      this.router.navigate(['dashboard']);

    } catch(e) {
      // Any validation error is wrapped as APISafeException
      // error:
      // errorCategory: "NoUser"
      // errorMessage: "No user for email address "
      // path: "/login"
      // statusCode: 500
      // timestamp: "2020-06-15T20:27:08.353Z"

      if(e.error) {
        this.errorMessage = e.error.errorMessage;
        this.errorClass = e.error.errorCategory;
      } else {
        this.errorMessage = "Unknown error";
        this.errorClass = "Unknown";
      }
    }

    this.state = LoginState.onForm;
  }

}

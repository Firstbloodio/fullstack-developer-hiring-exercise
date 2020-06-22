import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

enum RegisterState {

  // User editing the login form
  onForm,

  // Waiting the signup API
  waitingApi,

  // After the API creates the account
  accountCreated,
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {
  // Login form fields
  registerDetails = {
    email: "",
    displayName: "",
    phone: "",
    password: ""
  };

  // Current register state
  state: RegisterState = RegisterState.onForm;

  // Expose to template
  states = RegisterState;

  // Validation error from the server-side
  errorMessage: string;

  // Expose for E2E testing
  errorClass: string;

  constructor(private http: HttpClient, private logger: NGXLogger, private router: Router) { }

  ngOnInit(): void {
  }




  /**
   * Login the user
   */
  async register(form) {
    this.state = RegisterState.waitingApi;
    this.logger.debug("Logging in with details", this.registerDetails);

    try {
      const reply = await this.http.post('/api/register', this.registerDetails).toPromise() as any;
      this.logger.debug("Got reply", reply);

      this.state  = RegisterState.accountCreated;

      // Reset the form
      this.errorMessage = null;
      form.reset();

    } catch(e) {

      this.logger.error("Authentication error", e);

      if(e.error) {
        this.errorMessage = e.error.errorMessage;
        this.errorClass = e.error.errorCategory;
      } else {
        this.errorMessage = "Unknown error";
        this.errorClass = "Unknown";
      }

      this.state = RegisterState.onForm;
    }

  }

}

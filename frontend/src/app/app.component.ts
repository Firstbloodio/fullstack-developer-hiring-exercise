import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { User } from './models';
import { Router } from '@angular/router';


/**
 * The state of the application when it is loading.
 */
enum LoadingState {

  // Browser still putting bits and pieces together
  initializing,

  // We have started the REST call to get in the logged in user information
  fetchingStoredUser,

  // Green light, let the user play with the UI
  loaded
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  title = 'Fullstack hiring exercise';

  // Expose to the templates
  loadingStates = LoadingState;

  // App starts with the initial state
  loadingState: LoadingState = LoadingState.initializing;

  // Current user data for the UI
  user: User;

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    // Watch for logged in state and user changes
    this.userService.currentUser.subscribe((data) => this.updateUser(data));
    this.fetchStoredUser();
  }

  /**
   * Use the saved session to reload the user data from the server side.
   */
  async fetchStoredUser() {
    this.loadingState = LoadingState.fetchingStoredUser;

    // This will trigger updateUser
    this.userService.fetchStoredUser();
  }

  updateUser(user: User | null) {
    this.user = user;

    // Mark the application loaded on when the user refresh cycle is complete for the first time
    if(this.loadingState === LoadingState.fetchingStoredUser) {
      this.loadingState = LoadingState.loaded;
    }

    if(user) {
      // Show user dashboard
      this.router.navigate(['dashboard']);
    } else {
      // User not yet signed in or just logged out
      // Triggers login modal
      this.router.navigate(['home']);
    }
  }

  logout() {
    this.userService.logout();
  }


}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  // Current user data for the UI
  user: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe((data) => { this.user = data });
  }

}

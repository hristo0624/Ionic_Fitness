import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {}

  get user() {
    return this.userService.user;
  }

}

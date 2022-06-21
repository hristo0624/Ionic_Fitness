import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit {

  constructor(
    private navCtrl: NavController,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  get user() {
    return this.userService.user;
  }

  continue() {
    window.localStorage.setItem('takeAssessmentIntro', 'completed');
    this.navCtrl.navigateRoot('/take-assessment');
  }

  leave() {
    this.navCtrl.back();
  }
}

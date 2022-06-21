import { Injectable } from '@angular/core';
import { Transphormer } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {}

  get user(): Transphormer | null {
    return <Transphormer>JSON.parse(window.localStorage.getItem('transphormer'));
  }

  public userPromise(): Promise<Transphormer> {
    const user = this.user;
    if (user) {
      return Promise.resolve(user);
    } else {
      return Promise.reject('No Transphormer available');
    }
  }
}

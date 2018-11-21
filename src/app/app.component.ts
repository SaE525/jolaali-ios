import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';

import{ LoginPage} from "../pages/login/login";
import {TabsPage} from "../pages/tabs/tabs";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(statusBar: StatusBar, splashScreen: SplashScreen,
             public platform: Platform,public http: Http) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.http.request('http://icanhazip.com/')
        .subscribe(response => {
          console.log(response.text());
          window.localStorage.setItem('ip',response.text());
        })
    });
    if (window.localStorage.getItem("rememberMe") == "false" || window.localStorage.getItem("rememberMe") == undefined) {
      window
        .localStorage
        .removeItem("userData");
      this.rootPage = LoginPage;
    } else{
      this.rootPage = TabsPage;
    }
  }
}

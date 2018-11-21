import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController} from 'ionic-angular';
import { FormBuilder, Validators} from "@angular/forms";
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";
import {LoginPage} from "../login/login";
import { App } from 'ionic-angular';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  passwordUpadateForm: any;
  oldPassword: any;
  newPassword: any;
  newcPassword: any;
  matchPassword: any = false;
  current: any = false;
  subUrl: any;
  user: any;
  loader: any;
  toast: any;
  toast1: any;

  constructor(public appCtrl: App, public navCtrl: NavController, public navParams: NavParams, public formpc: FormBuilder,
              public jolaaliserviceprovider: JolaaliServiceProvider, public ToastCtrl: ToastController,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.user = JSON.parse(window.localStorage.getItem("userData"));
    this.passwordUpadateForm = formpc.group({
      'oldPassword': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
      'newPassword': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
      'newcPassword': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]]
    });
    this.oldPassword = this.passwordUpadateForm.controls['oldPassword'];
    this.newPassword = this.passwordUpadateForm.controls['newPassword'];
    this.newcPassword = this.passwordUpadateForm.controls['newcPassword'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }

  notifyProgrss() {
    this.loader = this.loadingCtrl.create({
      content: "Updating..."
    });
    this.toast = this.ToastCtrl.create({
      message: "password changed",
      duration: 3000,
      position: "top"
    });
    this.toast1 = this.ToastCtrl.create({
      message: "Error while trying to update",
      duration: 3000,
      position: "bottom"
    });
  }

  validatePwd() {
    console.log("dtfwegfw");
    if (this.oldPassword.value !== atob(this.user.password)) {
      var confirm = this.alertCtrl.create({
        title: 'Jo Laali',
        message: 'Please enter correct old password',
        buttons: [{
          text: 'OK',
          handler: data => {
            this.passwordUpadateForm.controls['oldPassword'].reset();
          }
        }]
      });
      confirm.present();
  }  else {

}
}
  checkMatch() {
    if (this.newPassword.value == this.newcPassword.value && this.newPassword.value != "") {

    }
    else {
      var confirm = this.alertCtrl.create({
        title: 'Jo Laali',
        message: 'Password and Confirm Password must match ',
        buttons: [{
          text: 'OK',
          handler: data => {
            this.passwordUpadateForm.controls['newPassword'].reset();
            this.passwordUpadateForm.controls['newcPassword'].reset();
          }
        }]
      });
      confirm.present();
    }
  }

  updatepassword(){
    if(this.passwordUpadateForm.valid){
      this.notifyProgrss();
      this.loader.present();
      this.subUrl = "changepwd?uid=" +this.user.userId+"&npwd=" +this.newcPassword.value;
      console.log(this.subUrl);
      this.jolaaliserviceprovider.jolaaliservice(this.subUrl).subscribe((data) => {
        if(data.changepwdStatus == 'Success'){
          this.user.password = this.newcPassword.value;
          window
            .localStorage
            .setItem("userData", JSON.stringify(this.user));

          var confirm = this.alertCtrl.create({
            title: 'Jo Laali',
            message: 'Password changed successfully',
            buttons: [{
              text: 'OK',
              handler: data => {
                window
                  .localStorage
                  .removeItem("userData");
                window
                  .localStorage
                  .setItem("rememberMe", 'false');
                window
                  .localStorage
                  .removeItem("Subscription");
                this.appCtrl.getRootNav().setRoot(LoginPage);
                this.navCtrl.setRoot(LoginPage);
              }
            }]
          });
          this.loader.dismiss();
          confirm.present();
        }
        else{
          this.loader.dismiss();
          this.toast1.present();
        }
      },err => {
        this.loader.dismiss();
        this.toast1.present();
      })
    } else {
      this.passwordUpadateForm.get('oldPassword').markAsTouched();
      this.passwordUpadateForm.get('newPassword').markAsTouched();
      this.passwordUpadateForm.get('newcPassword').markAsTouched();
    }
  }
}

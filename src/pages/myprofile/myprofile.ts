import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { App } from 'ionic-angular';
import {LoginPage} from "../login/login";
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";



/**
 * Generated class for the MyprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html',
})
export class MyprofilePage {
  FirstName:any;
  LastName:any;
  MobileNumber:any;
  Email:any;
  user: any;
  subUrl: any;
  loader:any;
  toast:any;
  toast1:any;
  country:any;
  state:any;
  city:any;
  zip:any;
  addressLine1:any;
  addressLine2:any;

  constructor(public appCtrl: App, public navCtrl: NavController, public navParams: NavParams,
              public jolaaliserviceprovider: JolaaliServiceProvider, public ToastCtrl: ToastController,
              public loadingCtrl: LoadingController, public alertCtrl:AlertController) {
    this.user = JSON.parse(window.localStorage.getItem("userData"));

    this.FirstName = this.user.name;
    this.LastName = this.user.surname;
    this.Email = this.user.email;
    this.MobileNumber = this.user.mobile;
    this.country = this.user.country1;
    this.state = this.user.state;
    this.city = this.user.city;
    this.zip = this.user.zipcode;
    this.addressLine1 = this.user.address1;
    this.addressLine2 = this.user.address2;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyprofilePage');
  }

  notifyProgrss(){
    this.loader = this.loadingCtrl.create({
      content: "Updating..."
    });
    this.toast = this.ToastCtrl.create({
      message: "updated Succesfully",
      duration: 3000,
      position: "top"
    });
    this.toast1 = this.ToastCtrl.create({
      message: "Error while trying to update",
      duration: 3000,
      position: "bottom"
    });
  }

  updateProfile(){
    this.notifyProgrss();
    this.loader.present();
    this.subUrl = "editprofile?userid=" + this.user.userId + "&fname=" + this.FirstName + "&lname=" + this.LastName +
      "&email=" + this.user.email + "&mobile=" + this.MobileNumber;


      this.jolaaliserviceprovider.jolaaliservice(this.subUrl).subscribe((data) => {
        if (data.user_details == 'Updated') {
          this.user.name = this.FirstName;
          this.user.surname = this.LastName;
          this.user.mobile = this.MobileNumber;
          window
            .localStorage
            .setItem("userData", JSON.stringify(this.user));
          this.loader.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Jo Laali',
            message: 'Updated Succesfully',
            buttons: [
              {
                text: 'ok',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          });
          alert.present();
        }
        else {
          this.loader.dismiss();
          this.toast1.present();
        }
      }, err => {
        this.loader.dismiss();
        this.toast1.present();
      })

  }

  logOut(){
    let alert = this.alertCtrl.create({
      title: 'Jo Laali',
      message: 'Are you sure you want to Logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
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
          }
        }
      ]
    });
    alert.present();
  }
}

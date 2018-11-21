import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, ToastController, AlertController  } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SignupPage} from "../signup/signup";
import { TabsPage} from "../tabs/tabs";
import { ForgotpasswordPage} from "../forgotpassword/forgotpassword";
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  signInForm: any;
  email: any;
  password: any;
  validOne: any = false;
  rememberMe : any;
  loader: any;
  toast: any;
  toast1:any;
  subUrl: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public forml:FormBuilder,
              public jolaaliserviceprovider:JolaaliServiceProvider, public LoadingCtrl: LoadingController,
              public ToastCtrl: ToastController, public alertCtrl: AlertController) {
    this.signInForm = forml.group({

      'email': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.required, Validators.maxLength(100), Validators.email])],
      'password': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
      'rememberMe': []
    });

    this.email = this.signInForm.controls['email'];
    this.password = this.signInForm.controls['password'];
    this.rememberMe = this.signInForm.controls['rememberMe'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  notifyProgrss() {
    this.loader = this
      .LoadingCtrl
      .create({content: "Authenticating..."});
  }

  signUp(){
    this.navCtrl.push(SignupPage);
  }

  forgot(){
    this.navCtrl.push(ForgotpasswordPage);
  }
  popping(message){
    var confirm = this.alertCtrl.create({
      title: 'Jo Laali',
      message:message,
      buttons: [{
        text: 'OK',
        handler: data => {
        }
      }]
    });
    confirm.present();
  }

  doLogin(){
    if(this.signInForm.valid){
      this.notifyProgrss();

      this.subUrl = "login?email=" + this.email.value + "&pwd=" + this.password.value + "&ip="+ window.localStorage.getItem('ip');
      console.log(this.subUrl);
      this.loader.present();
      this.jolaaliserviceprovider.jolaaliservice(this.subUrl).subscribe((data) => {
         if(data.logged_user_details.status =="success"){

           this.jolaaliserviceprovider.jolaaliservice('getSubscriptionInfo?id='+ data.logged_user_details.userId).subscribe((res) => {
             console.log(res);
             window
               .localStorage
               .setItem("Subscription", JSON.stringify(res));
           })
           //data.logged_user_details.password = this.password.value;
           window
             .localStorage
             .setItem("userData", JSON.stringify(data.logged_user_details));
           if(this.rememberMe.value){
             window
                .localStorage
               .setItem("rememberMe", 'true');
           } else{
             window
               .localStorage
               .setItem("rememberMe", 'false');
           }
           this.navCtrl.setRoot(TabsPage);
           this.loader.dismiss();
         }
         else{
           this.loader.dismiss();
           this.popping(data.logged_user_details.status);
         }
      },err => {
        this.loader.dismiss();
        this.popping('Error while trying to login');

      })
    }else {
      this.signInForm.get('email').markAsTouched();
      this.signInForm.get('password').markAsTouched();

    }
  }

}

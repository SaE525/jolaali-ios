import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginPage} from "../login/login";
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  resetForm: any;
  email: any;
  suburl: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public  formr:FormBuilder,
              public alertCtrl: AlertController, public ToastCtrl: ToastController,
              public jolaaliserviceprovider:JolaaliServiceProvider ) {
    this.resetForm = formr.group({

      'email': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.required, Validators.maxLength(30), Validators.email])]
    });

    this.email = this.resetForm.controls['email'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }
  toast = this
    .ToastCtrl
    .create({message: "Error while trying", duration: 3000, position: "bottom"});
  progress(data,status) {
    var alert = this.alertCtrl.create({
      title: 'Jo Laali',
      message: data,
      buttons: [{
        text: 'OK',
        handler: data => {
          if(status == 0) {
            this.navCtrl.setRoot(LoginPage);
          }
          else{
            return;
          }
        }
      }]
    });
    alert.present();
  }
  reset(){
    if(this.resetForm.valid){
      this.suburl ="forgotpwd?email="+ this.email.value;
      this.jolaaliserviceprovider.jolaaliservice(this.suburl).subscribe((data) => {
        console.log(data);
        if(data.forgot_password == 'Invalid Email Address') {
          this.progress(data.forgot_password, 1);
        } else {
          this.progress(data.forgot_password, 0);
        }
      },err => {
        this.toast.present();
      })
    }else {
      this.resetForm.get('email').markAsTouched();
    }
  }

}

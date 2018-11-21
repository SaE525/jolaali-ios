import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginPage} from "../login/login";
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";
import { Http } from '@angular/http';


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signUpForm: any;
  firstName: any;
  lastName: any;
  email: any;
  mobileNumber: any;
  password: any;
  confirmPassword: any;
  country:any;
  state:any;
  city:any;
  zip:any;
  addressLine1:any;
  addressLine2:any;
  matchPassword: any;
  countries: any;
  subUrl: any;
  loader: any;
  toast: any;
  toast1:any;
  showList:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public LoadingCtrl: LoadingController, public ToastCtrl: ToastController,
              public alertCtrl: AlertController,public formb: FormBuilder,
              public jolaaliserviceprovider:JolaaliServiceProvider, public http:Http) {

    this.signUpForm = formb.group({

      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.required, Validators.maxLength(100), Validators.email])],
      'mobileNumber': ['', [Validators.required, Validators.minLength(10)]],
      'password': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
      'confirmPassword': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],
      'country':['', [Validators.required]],
      'state':['', [Validators.required]],
      'city':['', [Validators.required]],
      'zip':['', [Validators.required]],
      'addressLine1': ['', [Validators.required]],
      'addressLine2': ['', [Validators.required]]
    });
    this.firstName = this.signUpForm.controls['firstName'];
    this.lastName = this.signUpForm.controls['lastName'];
    this.email = this.signUpForm.controls['email'];
    this.mobileNumber = this.signUpForm.controls['mobileNumber'];
    this.password = this.signUpForm.controls['password'];
    this.confirmPassword = this.signUpForm.controls['confirmPassword'];
    this.country = this.signUpForm.controls['country'];
    this.state = this.signUpForm.controls['state'];
    this.city = this.signUpForm.controls['city'];
    this.zip = this.signUpForm.controls['zip'];
    this.addressLine1 = this.signUpForm.controls['addressLine1'];
    this.addressLine2 = this.signUpForm.controls['addressLine2'];

    this.http.request('https://restcountries.eu/rest/v2/all')
      .subscribe(response => {
        this.countries = JSON.parse(response.text());
      })

  }
  onKeyPress(event) {
    console.log(event.keyCode);
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || (event.keyCode > 47 && event.keyCode < 58)|| event.keyCode == 32 || event.keyCode == 46) {
      return true
    }
    else {
      return false
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  notifyProgrss() {
    this.loader = this.LoadingCtrl.create({
      content: "Registering user..."
    });
    this.toast = this.ToastCtrl.create({
      message: "System error",
      duration: 3000,
      position: "middle"
    });
    this.toast1 = this.ToastCtrl.create({
      message: "Email already exists",
      duration: 3000,
      position: "middle"
    });
  }
  checkMatch() {
    if (this.password.value == this.confirmPassword.value && this.password.value != "") {
      this.matchPassword = false;
    }
    else {
      var confirm = this.alertCtrl.create({
        title: 'Jo Laali',
        message: 'New Password & Confirm Password do not match',
        buttons: [{
          text: 'OK',
          handler: data => {
            this.signUpForm.controls['password'].reset();
            this.signUpForm.controls['confirmPassword'].reset();

          }
        }]
      });
      confirm.present();
    }
  }

  signUp(){
    if(this.signUpForm.valid){
      this.subUrl = "signup?fname=" + this.firstName.value +
        "&lname=" + this.lastName.value + "&email=" + this.email.value +
        "&mobile=" + this.mobileNumber.value + "&pwd=" + this.password.value +
        "&ip=" + window.localStorage.getItem('ip') + "&address1=" + this.addressLine1.value +
        "&address2=" + this.addressLine2.value + "&city=" + this.city.value + "&state=" +  this.state.value +
        "&country1=" + this.country.value + "&zipcode=" + this.zip.value;
      this.jolaaliserviceprovider.jolaaliservice(this.subUrl).subscribe((data) => {
        this.notifyProgrss();
        var confirm = this.alertCtrl.create({
          title: 'Jo Laali',
          message: 'Successfully Registered',
          buttons: [{
            text: 'OK',
            handler: data => {
              this.navCtrl.setRoot(LoginPage);
            }
          }]
        });
        if(data.user_details == 'Created'){
          this.loader.dismiss();
          confirm.present();
        }
        else if(data.user_details == "Email already exists"){
          this.loader.dismiss();
          var confirm1 = this.alertCtrl.create({
            title: 'Jo Laali',
            message: data.user_details,
            buttons: [{
              text: 'OK',
              handler: data => {

              }
            }]
          });
          confirm1.present();
        }
      },err => {
        this.toast.present();
        this.loader.dismiss();
      })
    }else {
      this.signUpForm.get('firstName').markAsTouched();
      this.signUpForm.get('lastName').markAsTouched();
      this.signUpForm.get('email').markAsTouched();
      this.signUpForm.get('mobileNumber').markAsTouched();
      this.signUpForm.get('password').markAsTouched();
      this.signUpForm.get('confirmPassword').markAsTouched();
      this.signUpForm.get('country').markAsTouched();
      this.signUpForm.get('state').markAsTouched();
      this.signUpForm.get('city').markAsTouched();
      this.signUpForm.get('zip').markAsTouched();
      this.signUpForm.get('addressLine1').markAsTouched();
      this.signUpForm.get('addressLine2').markAsTouched();
    }

  }


}

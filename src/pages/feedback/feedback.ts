import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";


/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  formObj:any={
    feedBack:""
  }
  subUrl: any;
  loader:any;
  toast:any;
  toast1:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public jolaaliserviceprovider: JolaaliServiceProvider, public  ToastCtrl: ToastController,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController){

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  notifyProgrss(){
    this.loader = this.loadingCtrl.create({
      content: "Submitting..."
    });
    this.toast = this.ToastCtrl.create({
      message: "feedback sent successfully ",
      duration: 3000,
      position: "top"
    });
    this.toast1 = this.ToastCtrl.create({
      message: "Error while trying to send feedback",
      duration: 3000,
      position: "bottom"
    });
  }

  submitFeedback() {
    console.log(this.formObj.feedBack.length)
    if (this.formObj.feedBack.length > 0) {
      this.notifyProgrss();
      this.loader.present();
      this.subUrl = "sendfeedback?uid=" + (JSON.parse(window.localStorage.getItem("userData")).userId) + "&msg=" + this.formObj.feedBack;
      this.jolaaliserviceprovider.jolaaliservice(this.subUrl).subscribe((data) => {
        if (data.user_feedback == 'Thank you.') {
          this.loader.dismiss();
          var confirm = this.alertCtrl.create({
            title: 'Jo Laali',
            message: 'Thanks for your valuable feedback.',
            buttons: [{
              text: 'OK',
              handler: data => {
                this.formObj.feedBack = '';
              }
            }]
          });
          confirm.present();
        }
        else {
          this.loader.dismiss();
          var confirm1 = this.alertCtrl.create({
            title: 'Jo Laali',
            message: 'Error while trying to send feedback. Please try again.',
            buttons: [{
              text: 'OK',
              handler: data => {

              }
            }]
          });
          confirm1.present();
        }
      }, err => {
        this.loader.dismiss();
        var confirm2 = this.alertCtrl.create({
          title: 'Jo Laali',
          message: 'Error while trying to send feedback. PLease try again.',
          buttons: [{
            text: 'OK',
            handler: data => {

            }
          }]
        });
        confirm2.present();
      })
    } else{
      var confirm = this.alertCtrl.create({
        title: 'Jo Laali',
        message: 'Your feedback cannot be blank.',
        buttons: [{
          text: 'OK',
          handler: data => {
          }
        }]
      });
      confirm.present();
    }
  }

}
